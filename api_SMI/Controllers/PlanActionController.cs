using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlanActionController : ControllerBase
    {
        private readonly IPlanActionService _service;

        public PlanActionController(IPlanActionService service)
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
            var pa = _service.GetById(id);
            if (pa == null) return NotFound();
            return Ok(pa);
        }

        [HttpPost]
        public IActionResult Create(PlanAction planAction)
        {
            _service.Add(planAction);
            return CreatedAtAction(nameof(GetById), new { id = planAction.Id }, planAction);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, PlanAction planAction)
        {
            if (id != planAction.Id) return BadRequest();
            _service.Update(planAction);
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
