using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntiteController : ControllerBase
    {
        private readonly IEntiteService _service;

        public EntiteController(IEntiteService service)
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
            var entite = _service.GetById(id);
            if (entite == null) return NotFound();
            return Ok(entite);
        }

        [HttpPost]
        public IActionResult Create(Entite entite)
        {
            _service.Add(entite);
            return CreatedAtAction(nameof(GetById), new { id = entite.Id }, entite);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Entite entite)
        {
            if (id != entite.Id) return BadRequest();
            _service.Update(entite);
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
