using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ValiditeProcessusController : ControllerBase
    {
        private readonly ValiditeProcessusService _service;

        public ValiditeProcessusController(ValiditeProcessusService service)
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
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("by-processus/{processusId}")]
        public IActionResult GetByProcessus(int processusId)
        {
            return Ok(_service.GetByProcessus(processusId));
        }

        [HttpPost]
        public IActionResult Create(ValiditeProcessus validite)
        {
            _service.Add(validite);
            return CreatedAtAction(nameof(GetById), new { id = validite.Id }, validite);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ValiditeProcessus validite)
        {
            if (id != validite.Id) return BadRequest();
            _service.Update(validite);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpDelete("by-processus/{processusId}")]
        public IActionResult DeleteByProcessus(int processusId)
        {
            _service.DeleteByProcessus(processusId);
            return NoContent();
        }
    }
}
