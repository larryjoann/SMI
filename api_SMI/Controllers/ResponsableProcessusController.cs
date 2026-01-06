using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResponsableProcessusController : ControllerBase
    {
        private readonly IResponsableProcessusService _service;

        public ResponsableProcessusController(IResponsableProcessusService service)
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
            var responsableProcessus = _service.GetById(id);
            if (responsableProcessus == null) return NotFound();
            return Ok(responsableProcessus);
        }

        [HttpGet("by-processus/{idProcessus}")]
        public IActionResult GetByProcessus(int idProcessus)
        {
            return Ok(_service.GetByProcessus(idProcessus));
        }

        [HttpGet("by-collaborateur/{matriculeCollaborateur}")]
        public IActionResult GetByCollaborateur(string matriculeCollaborateur)
        {
            return Ok(_service.GetByCollaborateur(matriculeCollaborateur));
        }

        [HttpGet("by-type/{idTypeResponsableProcessus}")]
        public IActionResult GetByType(int idTypeResponsableProcessus)
        {
            return Ok(_service.GetByType(idTypeResponsableProcessus));
        }

        [HttpGet("by-processus-and-type/{idProcessus}/{idTypeResponsableProcessus}")]
        public IActionResult GetByProcessusAndType(int idProcessus, int idTypeResponsableProcessus)
        {
            return Ok(_service.GetByProcessusAndType(idProcessus, idTypeResponsableProcessus));
        }

        [HttpPost]
        public IActionResult Create(ResponsableProcessus responsableProcessus)
        {
            _service.Add(responsableProcessus);
            return CreatedAtAction(nameof(GetById), new { id = responsableProcessus.Id }, responsableProcessus);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ResponsableProcessus responsableProcessus)
        {
            if (id != responsableProcessus.Id) return BadRequest();
            _service.Update(responsableProcessus);
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
