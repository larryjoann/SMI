using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PieceJointeNcController : ControllerBase
    {
        private readonly IPieceJointeNcService _service;
        private readonly IWebHostEnvironment _env;

        public PieceJointeNcController(IPieceJointeNcService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        // Création + upload du fichier
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] IFormFile fichier, [FromForm] int idNc)
        {
            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var fileStorage = new FileStorageService(uploadFolder);

            var cheminRelatif = await fileStorage.SaveFileAsync(fichier);

            var piece = new PieceJointeNc
            {
                IdNc = idNc,
                NomFichier = fichier.FileName,
                CheminFichier = cheminRelatif
            };
            _service.Add(piece);

            return Ok(piece);
        }

        // Création + upload de plusieurs fichiers
        [HttpPost("multi")]
        public async Task<IActionResult> CreateMultiple([FromForm] List<IFormFile> fichiers, [FromForm] int idNc)
        {
            if (fichiers == null || fichiers.Count == 0)
                return BadRequest("Aucun fichier envoyé.");

            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var fileStorage = new FileStorageService(uploadFolder);

            var pieces = new List<PieceJointeNc>();
            var chemins = await fileStorage.SaveFilesAsync(fichiers);

            for (int i = 0; i < fichiers.Count; i++)
            {
                var piece = new PieceJointeNc
                {
                    IdNc = idNc,
                    NomFichier = fichiers[i].FileName,
                    CheminFichier = chemins[i]
                };
                pieces.Add(piece);
            }

            _service.AddRange(pieces);

            return Ok(pieces);
        }

        // Récupérer toutes les pièces jointes
        [HttpGet]
        public IActionResult GetAll()
        {
            var pieces = _service.GetAll();
            return Ok(pieces);
        }

        // Récupérer une pièce jointe par son id
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var piece = _service.GetById(id);
            if (piece == null)
                return NotFound();
            return Ok(piece);
        }

        // Récupérer les pièces jointes d'une non-conformité
        [HttpGet("nc/{idNc}")]
        public IActionResult GetByNonConformite(int idNc)
        {
            var pieces = _service.GetByNonConformite(idNc);
            return Ok(pieces);
        }

        // Supprimer une pièce jointe
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}