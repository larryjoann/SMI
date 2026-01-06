using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TypeResponsableProcessusController : ControllerBase
    {
        private readonly ITypeResponsableProcessusService _service;

        public TypeResponsableProcessusController(ITypeResponsableProcessusService service)
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
            var typeResponsableProcessus = _service.GetById(id);
            if (typeResponsableProcessus == null) return NotFound();
            return Ok(typeResponsableProcessus);
        }

        [HttpGet("by-role/{idRole}")]
        public IActionResult GetByRole(int idRole)
        {
            return Ok(_service.GetByRole(idRole));
        }

        [HttpPost]
        public IActionResult Create(TypeResponsableProcessus typeResponsableProcessus)
        {
            _service.Add(typeResponsableProcessus);
            return CreatedAtAction(nameof(GetById), new { id = typeResponsableProcessus.Id }, typeResponsableProcessus);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, TypeResponsableProcessus typeResponsableProcessus)
        {
            if (id != typeResponsableProcessus.Id) return BadRequest();
            _service.Update(typeResponsableProcessus);
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
