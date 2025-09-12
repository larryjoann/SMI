using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessusController : ControllerBase
    {
        private readonly ProcessusService _service;

        public ProcessusController(ProcessusService service)
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
            var processus = _service.GetById(id);
            if (processus == null) return NotFound();
            return Ok(processus);
        }

        [HttpPost]
        public IActionResult Create(Processus processus)
        {
            _service.Add(processus);
            return CreatedAtAction(nameof(GetById), new { id = processus.Id }, processus);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Processus processus)
        {
            if (id != processus.Id) return BadRequest();
            _service.Update(processus);
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