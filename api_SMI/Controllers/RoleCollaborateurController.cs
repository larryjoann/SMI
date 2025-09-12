using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleCollaborateurController : ControllerBase
    {
        private readonly RoleCollaborateurService _service;

        public RoleCollaborateurController(RoleCollaborateurService service)
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
            var roleCollaborateur = _service.GetById(id);
            if (roleCollaborateur == null) return NotFound();
            return Ok(roleCollaborateur);
        }

        [HttpPost]
        public IActionResult Create(RoleCollaborateur roleCollaborateur)
        {
            _service.Add(roleCollaborateur);
            return CreatedAtAction(nameof(GetById), new { id = roleCollaborateur.Id }, roleCollaborateur);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, RoleCollaborateur roleCollaborateur)
        {
            if (id != roleCollaborateur.Id) return BadRequest();
            _service.Update(roleCollaborateur);
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