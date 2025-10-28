using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentaireNcController : ControllerBase
    {
        private readonly ICommentaireNcService _service;
    

        public CommentaireNcController(ICommentaireNcService service, ILogger<CommentaireNcController> logger)
        {
            _service = service;
            
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var c = _service.GetById(id);
            if (c == null) return NotFound();
            return Ok(c);
        }

        [HttpGet("nc/{idNc}")]
        public IActionResult GetByNc(int idNc) => Ok(_service.GetByNc(idNc));

        [HttpPost]
        public IActionResult Create(CommentaireNc entity)
        {
            // Diagnostic: log session id and cookies to verify the session cookie is sent with this POST
            try
            {
                Console.WriteLine($"Session.Id in commentaire Create: {HttpContext.Session.Id}");
                foreach (var c in HttpContext.Request.Cookies)
                {
                    Console.WriteLine($"Request cookie in commentaire Create: {c.Key} = {c.Value}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur lors du logging des cookies/session dans Create: " + ex.Message);
            }

            var matricule = HttpContext.Session.GetString("matricule");

            Console.WriteLine($"Matricule enregistré en session commentaire: {matricule}");

            if (string.IsNullOrEmpty(matricule))
                return Unauthorized(new { message = "Utilisateur non authentifié (matricule en session manquant)." });

            entity.MatriculeCollaborateur = matricule;
            _service.Add(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, CommentaireNc entity)
        {
            if (id != entity.Id) return BadRequest();
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
                return Unauthorized(new { message = "Utilisateur non authentifié (matricule en session manquant)." });

            entity.MatriculeCollaborateur = matricule;
            _service.Update(entity);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }
    }
}
