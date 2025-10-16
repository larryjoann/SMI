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

        [HttpPost("declare")]
        public IActionResult Declare(NonConformite nonConformite)
        {
            if (!TryValidateModel(nonConformite))
            {
                return ValidationProblem(ModelState);
            }
            _service.Declare(nonConformite);
            return CreatedAtAction(nameof(GetById), new { id = nonConformite.Id }, nonConformite);
        }

        [HttpPost("draft")]
        public IActionResult Draft(NonConformite nonConformite)
        {
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