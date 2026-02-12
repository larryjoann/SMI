using Microsoft.AspNetCore.Mvc;
using api_SMI.Services;
using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FrequenceMesureController : ControllerBase
    {
        private readonly IFrequenceMesureService _service;

        public FrequenceMesureController(IFrequenceMesureService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<FrequenceMesure>> Get() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public ActionResult<FrequenceMesure> Get(int id)
        {
            var item = _service.GetById(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public IActionResult Post([FromBody] FrequenceMesure model)
        {
            _service.Add(model);
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] FrequenceMesure model)
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