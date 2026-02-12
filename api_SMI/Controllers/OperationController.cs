using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class OperationController : ControllerBase
    {
        private readonly IOperationService _service;

        public OperationController(IOperationService service)
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
            var operation = _service.GetById(id);
            if (operation == null) return NotFound();
            return Ok(operation);
        }

        [HttpPost]
        public IActionResult Create(Operation operation)
        {
            _service.Add(operation);
            return CreatedAtAction(nameof(GetById), new { id = operation.Id }, operation);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Operation operation)
        {
            if (id != operation.Id) return BadRequest();
            _service.Update(operation);
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
