using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IntercationController : ControllerBase
    {
        private readonly IIntercationService _service;

        public IntercationController(IIntercationService service)
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
        public IActionResult Create(Intercation intercation)
        {
            _service.Add(intercation);
            return CreatedAtAction(nameof(GetById), new { id = intercation.Id }, intercation);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Intercation intercation)
        {
            if (id != intercation.Id) return BadRequest();
            _service.Update(intercation);
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