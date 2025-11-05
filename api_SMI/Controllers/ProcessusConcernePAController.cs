using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessusConcernePAController : ControllerBase
    {
        private readonly IProcessusConcernePAService _service;

        public ProcessusConcernePAController(IProcessusConcernePAService service)
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
            var pc = _service.GetById(id);
            if (pc == null) return NotFound();
            return Ok(pc);
        }

        [HttpPost]
        public IActionResult Create(ProcessusConcernePA pc)
        {
            _service.Add(pc);
            return CreatedAtAction(nameof(GetById), new { id = pc.Id }, pc);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ProcessusConcernePA pc)
        {
            if (id != pc.Id) return BadRequest();
            _service.Update(pc);
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
