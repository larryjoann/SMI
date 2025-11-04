using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text.Json;

namespace api_SMI.Controllers
{
    //[ApiController]
    [Route("api/[controller]")]
    public class SourceActionController : ControllerBase
    {
        private readonly ISourceActionService _service;

        public SourceActionController(ISourceActionService service)
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
            var entity = _service.GetById(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        [HttpPost]
        public IActionResult Create(SourceAction source)
        {
            _service.Add(source);
            return CreatedAtAction(nameof(GetById), new { id = source.Id }, source);
        }

        [HttpPost("range")]
        public IActionResult CreateRange([FromBody] IEnumerable<SourceAction> sources)
        {
            if (sources == null || !sources.Any()) return BadRequest("Aucune source fournie.");
            _service.AddRange(sources);
            return Ok(sources);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SourceAction source)
        {
            Console.WriteLine($"Update déclenché pour SourceAction ID: {id}");
            Console.WriteLine(JsonSerializer.Serialize(source));
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
