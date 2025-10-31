using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using System.IO;
using System;

namespace api_SMI.Controllers
{
    //[ApiController]
    [Route("api/[controller]")]
    public class NCDetailsController : ControllerBase
    {
        private readonly INCDetailsService _service;

        public NCDetailsController(INCDetailsService service)
        {
            _service = service;
        }

        // GET: api/NCDetails
        [HttpGet]
        public IActionResult GetAll()
        {
            var details = _service.GetAll();
            return Ok(details);
        }

        [HttpGet("by-matricule")]
        public IActionResult GetAllByMatricule()
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            var list = _service.GetAllByMatricule(matricule);
            return Ok(list);
        }

        // GET: api/NCDetails/drafts
        [HttpGet("drafts")]
        public IActionResult GetDrafts()
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            var drafts = _service.GetDrafts(matricule);
            return Ok(drafts);
        }

        [HttpGet("declare")]
        public IActionResult GetDeclare()
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            var drafts = _service.GetDeclare(matricule);
            return Ok(drafts);
        }

        [HttpGet("archived")]
        public IActionResult GetArchived()
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            var drafts = _service.GetArchived(matricule);
            return Ok(drafts);
        }

        // GET: api/NCDetails/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetails(int id)
        {
            var details = _service.GetDetails(id);
            if (details == null)
                return NotFound();
            return Ok(details);
        }

        [HttpPut("archiver/{id}")]
        public IActionResult Archive(int id)
        {
             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            _service.Archiver(id, matricule);
            return NoContent();
        }

        [HttpPut("restorer/{id}")]
        public IActionResult Restorer(int id)
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            _service.Restorer(id , matricule);
            return NoContent();
        }

        // POST: api/NCDetails/declare
        // Accepts multipart/form-data with a JSON part named "details" (string) and file parts named "fichiers".
        [HttpPost("declare")]
        public async Task<IActionResult> Declare([FromForm] string details, [FromForm] List<IFormFile>? fichiers)
        {
            if (string.IsNullOrEmpty(details))
                return BadRequest("Invalid NCDetails data.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsObj = JsonSerializer.Deserialize<NCDetails>(details, options);
            if (detailsObj == null || detailsObj.NC == null)
                return BadRequest("Invalid NCDetails data.");

            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            detailsObj.NC.MatriculeEmetteur = matricule;

            detailsObj.PiecesJointes = new List<PieceJointeNc>();
            // Save uploaded files (if any) and add to detailsObj.PiecesJointes
            if (fichiers != null && fichiers.Count > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                var fileStorage = new FileStorageService(uploadFolder);
                var chemins = await fileStorage.SaveFilesAsync(fichiers);

                for (int i = 0; i < fichiers.Count; i++)
                {
                    var piece = new PieceJointeNc
                    {
                        // IdNc will be set when NC is persisted by the service if EF is configured for relationships
                        NomFichier = fichiers[i].FileName,
                        CheminFichier = chemins[i]
                    };
                    Console.WriteLine("File saved: " + chemins[i]);
                    detailsObj.PiecesJointes.Add(piece);
                }
            }

            detailsObj.NC.DateTimeDeclare = DateTime.Now;
            // Force la validation personnalisée
            if (!TryValidateModel(detailsObj))
                return BadRequest(ModelState);

            _service.Declare(detailsObj, matricule);
            return CreatedAtAction(nameof(GetDetails), new { id = detailsObj.NC.Id }, detailsObj);
        }

        // POST: api/NCDetails/draft
        // Accepts multipart/form-data with a JSON part named "details" (string) and file parts named "fichiers".
        [HttpPost("draft")]
        public async Task<IActionResult> Draft([FromForm] string details, [FromForm] List<IFormFile>? fichiers)
        {
            if (string.IsNullOrEmpty(details))
                return BadRequest("Invalid NCDetails data.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsObj = JsonSerializer.Deserialize<NCDetails>(details, options);
            if (detailsObj == null || detailsObj.NC == null)
                return BadRequest("Invalid NCDetails data.");

            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            detailsObj.NC.MatriculeEmetteur = matricule;

            detailsObj.PiecesJointes = new List<PieceJointeNc>();
            if (fichiers != null && fichiers.Count > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                var fileStorage = new FileStorageService(uploadFolder);
                var chemins = await fileStorage.SaveFilesAsync(fichiers);

                for (int i = 0; i < fichiers.Count; i++)
                {
                    var piece = new PieceJointeNc
                    {
                        NomFichier = fichiers[i].FileName,
                        CheminFichier = chemins[i]
                    };
                    detailsObj.PiecesJointes.Add(piece);
                }
            }
            Console.WriteLine("nombre de fichiers draft: " + fichiers.Count);
            _service.Draft(detailsObj, matricule);
            return CreatedAtAction(nameof(GetDetails), new { id = detailsObj.NC.Id }, detailsObj);
        }

        [HttpPost("DraftToDeclare/{id}")]
        public async Task<IActionResult> DraftToDeclare(int id, [FromForm] string details, [FromForm] List<IFormFile>? fichiers)
        {
            if (string.IsNullOrEmpty(details))
                return BadRequest("Invalid NCDetails data.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsObj = JsonSerializer.Deserialize<NCDetails>(details, options);
            if (detailsObj == null || detailsObj.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != detailsObj.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            detailsObj.NC.DateTimeDeclare = DateTime.Now;

            //detailsObj.PiecesJointes = new List<PieceJointeNc>();
            if (fichiers != null && fichiers.Count > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                var fileStorage = new FileStorageService(uploadFolder);
                var chemins = await fileStorage.SaveFilesAsync(fichiers);

                for (int i = 0; i < fichiers.Count; i++)
                {
                    var piece = new PieceJointeNc
                    {
                        NomFichier = fichiers[i].FileName,
                        CheminFichier = chemins[i]
                    };
                    detailsObj.PiecesJointes.Add(piece);
                }
            }

            if (!TryValidateModel(detailsObj))
                return BadRequest(ModelState);

             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            _service.DraftToDeclare(detailsObj, matricule);

            return Ok(new { id = detailsObj.NC.Id });
        }

        [HttpPost("updateDraft/{id}")]
        // Accepts multipart/form-data with a JSON part named "details" and optional file parts named "fichiers".
        public async Task<IActionResult> UpdateDraft(int id, [FromForm] string details, [FromForm] List<IFormFile>? fichiers)
        {
            if (string.IsNullOrEmpty(details))
                return BadRequest("Invalid NCDetails data.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsObj = JsonSerializer.Deserialize<NCDetails>(details, options);
            if (detailsObj == null || detailsObj.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != detailsObj.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            // Ensure PiecesJointes list exists
            if (detailsObj.PiecesJointes == null)
                detailsObj.PiecesJointes = new List<PieceJointeNc>();

            detailsObj.PiecesJointes = new List<PieceJointeNc>();
            if (fichiers != null && fichiers.Count > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                var fileStorage = new FileStorageService(uploadFolder);
                var chemins = await fileStorage.SaveFilesAsync(fichiers);

                for (int i = 0; i < fichiers.Count; i++)
                {
                    var piece = new PieceJointeNc
                    {
                        NomFichier = fichiers[i].FileName,
                        CheminFichier = chemins[i]
                    };
                    detailsObj.PiecesJointes.Add(piece);
                }
            }

            _service.Update(detailsObj, matricule);

            return Ok(new { id = detailsObj.NC.Id });
        }

        [HttpPost("updateDeclare/{id}")]
        // Accepts multipart/form-data with a JSON part named "details" and optional file parts named "fichiers".
        public async Task<IActionResult> UpdateDeclare(int id, [FromForm] string details, [FromForm] List<IFormFile>? fichiers)
        {
            if (string.IsNullOrEmpty(details))
                return BadRequest("Invalid NCDetails data.");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsObj = JsonSerializer.Deserialize<NCDetails>(details, options);
            if (detailsObj == null || detailsObj.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != detailsObj.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            // Save uploaded files (if any) and add to detailsObj.PiecesJointes
            if (detailsObj.PiecesJointes == null)
                detailsObj.PiecesJointes = new List<PieceJointeNc>();

            detailsObj.PiecesJointes = new List<PieceJointeNc>();
            if (fichiers != null && fichiers.Count > 0)
            {
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                var fileStorage = new FileStorageService(uploadFolder);
                var chemins = await fileStorage.SaveFilesAsync(fichiers);

                for (int i = 0; i < fichiers.Count; i++)
                {
                    var piece = new PieceJointeNc
                    {
                        NomFichier = fichiers[i].FileName,
                        CheminFichier = chemins[i]
                    };
                    detailsObj.PiecesJointes.Add(piece);
                }
            }

            // Force la validation personnalisée
            if (!TryValidateModel(detailsObj))
                return BadRequest(ModelState);

             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            _service.Update(detailsObj,matricule);

            return Ok(new { id = detailsObj.NC.Id });
        }

        [HttpPost("qualifier/{id}")]
        public IActionResult Qualifier(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            _service.Qualifier(details , details.NC.IdStatusNc.Value, matricule);

            return Ok(new { id = details.NC.Id });
        }        
    }
}