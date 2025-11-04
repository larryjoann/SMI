using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuiviActionController : ControllerBase
    {
        private readonly ISuiviActionService _service;

        public SuiviActionController(ISuiviActionService service)
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
        public IActionResult Create([FromBody] SuiviAction suivi)
        {
            Console.WriteLine("Création de SuiviAction reçue:");
            Console.WriteLine(JsonSerializer.Serialize(suivi));
            if (suivi == null) return BadRequest("Body is empty or invalid JSON.");
            if (suivi.IdAction <= 0) return BadRequest("IdAction must be provided and greater than 0.");

            _service.Add(suivi);
            return CreatedAtAction(nameof(GetById), new { id = suivi.Id }, suivi);
        }

        [HttpPost("range")]
        public IActionResult CreateRange(List<SuiviAction> suivis)
        {
            if (suivis == null || suivis.Count == 0) return BadRequest("Aucune SuiviAction fournie.");
            _service.AddRange(suivis);
            return Ok(suivis);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, SuiviAction suivi)
        {
            Console.WriteLine($"Update déclenché pour SuiviAction ID: {id}");
            Console.WriteLine(JsonSerializer.Serialize(suivi));
            if (id != suivi.Id) return BadRequest();
            _service.Update(suivi);
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
