using Microsoft.AspNetCore.Mvc;
using api_SMI.Services;
using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ObjectifController : ControllerBase
    {
        private readonly IObjectifService _service;

        public ObjectifController(IObjectifService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Objectif>> Get() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<Objectif> Get(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Objectif model)
        {
            _service.Add(model);
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Objectif model)
        {
            var existing = _service.GetById(id);
            if (existing == null) return NotFound();
            model.Id = id;
            _service.Update(model);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var existing = _service.GetById(id);
            if (existing == null) return NotFound();
            _service.Delete(id);
            return NoContent();
        }
    }
}