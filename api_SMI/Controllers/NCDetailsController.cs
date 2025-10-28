using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

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
        [HttpPost("declare")]
        public IActionResult Declare([FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");
            
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            details.NC.MatriculeEmetteur = matricule;
            details.NC.DateTimeDeclare = DateTime.Now;
            details.NC.DateTimeCreation = DateTime.Now;

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);

            _service.Declare(details, matricule);
            return CreatedAtAction(nameof(GetDetails), new { id = details.NC.Id }, details);
        }

        // POST: api/NCDetails/declare
        [HttpPost("draft")]
        public IActionResult Draft([FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            details.NC.MatriculeEmetteur = matricule;

            _service.Draft(details,matricule);
            return CreatedAtAction(nameof(GetDetails), new { id = details.NC.Id }, details);
        }

        [HttpPost("DraftToDeclare/{id}")]
        public IActionResult DraftToDeclare(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            details.NC.DateTimeDeclare = DateTime.Now;

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);

             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            _service.DraftToDeclare(details, matricule);

            return Ok(new { id = details.NC.Id });
        }

        [HttpPost("updateDraft/{id}")]
        public IActionResult UpdateDraft(int id, [FromBody] NCDetails details)
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

            _service.Update(details,matricule);

            return Ok(new { id = details.NC.Id });
        }

        [HttpPost("updateDeclare/{id}")]
        public IActionResult UpdateDeclare(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);

             var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            _service.Update(details,matricule);

            return Ok(new { id = details.NC.Id });
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