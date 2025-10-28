using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoriqueController : ControllerBase
    {
        private readonly IHistoriqueService _service;

        public HistoriqueController(IHistoriqueService service)
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

        [HttpGet("NC/{idObject}")]
        public IActionResult GetHistoriqueNCByid(int idObject)
        {
            var items = _service.GetByEntiteAndIdObject(2, idObject);
            return Ok(items);
        }


        [HttpPost]
        public IActionResult Create([FromBody] Historique historique)
        {
            if (historique == null) return BadRequest();
            _service.Add(historique);
            return CreatedAtAction(nameof(GetById), new { id = historique.Id }, historique);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Historique historique)
        {
            if (historique == null || id != historique.Id) return BadRequest();
            _service.Update(historique);
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
