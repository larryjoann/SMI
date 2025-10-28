using api_SMI.Models;
using api_SMI.Services;
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
            try
            {
                _service.ImportAllADCollaborateurs();
                return Ok(new { message = "Importation terminée." });
            }
            catch (InvalidOperationException ex)
            {
                // LDAP-specific error (bad creds, connectivity)
                Console.WriteLine($"ImportFromAD failed: {ex.Message}");
                return StatusCode(500, new { error = "Echec de l'accès à Active Directory. Vérifiez les identifiants et la connectivité.", detail = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ImportFromAD unexpected error: {ex.Message}");
                return StatusCode(500, new { error = "Erreur interne lors de l'importation depuis Active Directory.", detail = ex.Message });
            }
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
            var matricule = HttpContext.Session.GetString("matricule");
            Console.WriteLine($"Matricule enregistré en session get collab connecté: {matricule}");
            try
            {
                Console.WriteLine($"Session.Id en get session collab connecte: {HttpContext.Session.Id}");
                foreach (var c in HttpContext.Request.Cookies)
                {
                    Console.WriteLine($"Request cookie after login: {c.Key} = {c.Value}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur lors du logging des cookies/session après get collab: " + ex.Message);
            }

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