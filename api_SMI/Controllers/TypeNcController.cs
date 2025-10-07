using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TypeNcController : ControllerBase
    {
        private readonly ITypeNcService _service;

        public TypeNcController(ITypeNcService service)
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
            var typeNc = _service.GetById(id);
            if (typeNc == null) return NotFound();
            return Ok(typeNc);
        }

        [HttpPost]
        public IActionResult Create(TypeNc typeNc)
        {
            _service.Add(typeNc);
            return CreatedAtAction(nameof(GetById), new { id = typeNc.Id }, typeNc);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, TypeNc typeNc)
        {
            if (id != typeNc.Id) return BadRequest();
            _service.Update(typeNc);
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