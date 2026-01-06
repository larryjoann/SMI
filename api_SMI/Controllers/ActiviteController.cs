using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActiviteController : ControllerBase
    {
        private readonly IActiviteService _service;

        public ActiviteController(IActiviteService service)
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
        public IActionResult Create(Activite activite)
        {
            _service.Add(activite);
            return CreatedAtAction(nameof(GetById), new { id = activite.Id }, activite);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Activite activite)
        {
            if (id != activite.Id) return BadRequest();
            _service.Update(activite);
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