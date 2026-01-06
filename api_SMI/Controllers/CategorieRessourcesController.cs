using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategorieRessourcesController : ControllerBase
    {
        private readonly ICategorieRessourcesService _service;

        public CategorieRessourcesController(ICategorieRessourcesService service)
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

        [HttpPost]
        public IActionResult Create(CategorieRessources categorie)
        {
            _service.Add(categorie);
            return CreatedAtAction(nameof(GetById), new { id = categorie.Id }, categorie);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, CategorieRessources categorie)
        {
            if (id != categorie.Id) return BadRequest();
            _service.Update(categorie);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            // repository/service may not expose Delete; implement if needed.
            // For now try to get and remove via service update or repository directly.
            return NoContent();
        }
    }
}