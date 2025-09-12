using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize]
    public class CollaborateurController : ControllerBase
    {
        private readonly CollaborateurService _service;

        public CollaborateurController(CollaborateurService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpPost("import")]
        public IActionResult ImportFromAD()
        {
            Console.WriteLine("POST /api/Collaborateur/import appelé");
            _service.ImportAllADCollaborateurs();
            return Ok(new { message = "Importation terminée." });
        }
        
        [HttpGet("{matricule}")]
        public IActionResult GetByMatricule(string matricule)
        {
            var collab = _service.GetByMatricule(matricule);
            if (collab == null) return NotFound();
            return Ok(collab);
        }

        [HttpGet("collaborateur_connecte")]
        public IActionResult GetCollaborateurConnecte()
        {
            //var sessionId = HttpContext.Session.Id;
            var matricule = HttpContext.Session.GetString("matricule");
            //Console.WriteLine($"SessionId: {sessionId}, Matricule récupéré depuis la session lors de recup : {matricule}");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            return GetByMatricule(matricule);
        }


        [HttpPost]
        public IActionResult Create(Collaborateur collaborateur)
        {
            _service.Add(collaborateur);
            return CreatedAtAction(nameof(GetByMatricule), new { matricule = collaborateur.Matricule }, collaborateur);
        }

        [HttpPut("{matricule}")]
        public IActionResult Update(string matricule, Collaborateur collaborateur)
        {
            if (matricule != collaborateur.Matricule) return BadRequest();
            _service.Update(collaborateur);
            return NoContent();
        }

        [HttpDelete("{matricule}")]
        public IActionResult Delete(string matricule)
        {
            _service.Delete(matricule);
            return NoContent();
        }
    }
}