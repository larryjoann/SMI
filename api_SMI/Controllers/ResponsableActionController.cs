using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResponsableActionController : ControllerBase
    {
        private readonly IResponsableActionService _service;

        public ResponsableActionController(IResponsableActionService service)
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
        public IActionResult Create(ResponsableAction resp)
        {
            _service.Add(resp);
            return CreatedAtAction(nameof(GetById), new { id = resp.Id }, resp);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ResponsableAction resp)
        {
            Console.WriteLine($"Update déclenché pour ResponsableAction ID: {id}");
            Console.WriteLine(JsonSerializer.Serialize(resp));
            if (id != resp.Id) return BadRequest();
            _service.Update(resp);
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
