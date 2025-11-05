using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatusPAController : ControllerBase
    {
        private readonly IStatusPAService _service;

        public StatusPAController(IStatusPAService service)
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
            var s = _service.GetById(id);
            if (s == null) return NotFound();
            return Ok(s);
        }

        [HttpPost]
        public IActionResult Create(StatusPA status)
        {
            _service.Add(status);
            return CreatedAtAction(nameof(GetById), new { id = status.Id }, status);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, StatusPA status)
        {
            if (id != status.Id) return BadRequest();
            _service.Update(status);
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
