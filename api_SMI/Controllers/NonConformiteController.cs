using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NonConformiteController : ControllerBase
    {
        private readonly INonConformiteService _service;

        public NonConformiteController(INonConformiteService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var nc = _service.GetById(id);
            if (nc == null) return NotFound();
            return Ok(nc);
        }

        [HttpGet("by-matricule/{matricule}")]
        public IActionResult GetAllByMatricule(string matricule)
        {
            var list = _service.GetAllByMatricule(matricule);
            return Ok(list);
        }

        [HttpPost("declare")]
        public IActionResult Declare(NonConformite nonConformite)
        {
            if (!TryValidateModel(nonConformite))
            {
                return ValidationProblem(ModelState);
            }

            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            nonConformite.MatriculeEmetteur = matricule;
            _service.Declare(nonConformite);
            return CreatedAtAction(nameof(GetById), new { id = nonConformite.Id }, nonConformite);
        }

        [HttpPost("draft")]
        public IActionResult Draft(NonConformite nonConformite)
        {
            var matricule = HttpContext.Session.GetString("matricule");
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            nonConformite.MatriculeEmetteur = matricule;
            _service.Draft(nonConformite);
            return CreatedAtAction(nameof(GetById), new { id = nonConformite.Id }, nonConformite);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, NonConformite nonConformite)
        {
            if (id != nonConformite.Id) return BadRequest();
            _service.Update(nonConformite);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPut("archiver/{id}")]
        public IActionResult Archiver(int id)
        {
            var nc = _service.GetById(id);
            if (nc == null) return NotFound();
            _service.Archiver(id);
            return NoContent();
        }
    }
}