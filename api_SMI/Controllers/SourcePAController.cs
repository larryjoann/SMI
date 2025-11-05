using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SourcePAController : ControllerBase
    {
        private readonly ISourcePAService _service;

        public SourcePAController(ISourcePAService service)
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
            var source = _service.GetById(id);
            if (source == null) return NotFound();
            return Ok(source);
        }

        [HttpPost]
        public IActionResult Create(SourcePA source)
        {
            _service.Add(source);
            return CreatedAtAction(nameof(GetById), new { id = source.Id }, source);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SourcePA source)
        {
            if (id != source.Id) return BadRequest();
            _service.Update(source);
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
