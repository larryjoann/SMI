using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessusConcerneNcController : ControllerBase
    {
        private readonly IProcessusConcerneNcService _service;

        public ProcessusConcerneNcController(IProcessusConcerneNcService service)
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
        public IActionResult Create(ProcessusConcerneNc entity)
        {
            _service.Add(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ProcessusConcerneNc entity)
        {
            if (id != entity.Id) return BadRequest();
            _service.Update(entity);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpDelete]
        public IActionResult DeleteAll()
        {
            _service.DeleteAll();
            return NoContent();
        }
    }
}