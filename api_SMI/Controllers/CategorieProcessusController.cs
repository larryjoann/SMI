using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategorieProcessusController : ControllerBase
    {
        private readonly CategorieProcessusService _service;

        public CategorieProcessusController(CategorieProcessusService service)
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
            var categorie = _service.GetById(id);
            if (categorie == null) return NotFound();
            return Ok(categorie);
        }

        [HttpPost]
        public IActionResult Create(CategorieProcessus categorie)
        {
            _service.Add(categorie);
            return CreatedAtAction(nameof(GetById), new { id = categorie.Id }, categorie);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, CategorieProcessus categorie)
        {
            if (id != categorie.Id) return BadRequest();
            _service.Update(categorie);
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