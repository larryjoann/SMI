using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;

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
            if (fichier == null || fichier.Length == 0)
                return BadRequest("Aucun fichier envoyé.");

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

            var chemins = await fileStorage.SaveFilesAsync(fichiers);
            var pieces = new List<PieceJointeNc>();

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

            Console.WriteLine($"Nombre de fichiers uploadés: {pieces.Count}");
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

        // Télécharger une pièce jointe par son id
        [HttpGet("download/{id}")]
        public IActionResult Download(int id)
        {
            var piece = _service.GetById(id);
            // Console.WriteLine("Téléchargement de la pièce jointe ID: " + id);
            // Console.WriteLine("Détails de la pièce jointe: " + (piece != null ? piece.NomFichier : "Non trouvée"));
            // Console.WriteLine("Cheminde la pièce jointe: " + (piece != null ? piece.CheminFichier : "Non trouvée"));
            if (piece == null)
                return NotFound();

            var relativePath = (piece.CheminFichier ?? string.Empty).Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

            if (!System.IO.File.Exists(filePath))
                return NotFound();

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(piece.NomFichier ?? filePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);

            Response.Headers["Content-Disposition"] = $"attachment; filename=\"{piece.NomFichier}\"";

            return File(stream, contentType, piece.NomFichier);
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