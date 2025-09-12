using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriePermissionController : ControllerBase
    {
        private readonly CategoriePermissionService _service;

        public CategoriePermissionController(CategoriePermissionService service)
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
        public IActionResult Create(CategoriePermission categoriePermission)
        {
            _service.Add(categoriePermission);
            return CreatedAtAction(nameof(GetById), new { id = categoriePermission.Id }, categoriePermission);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, CategoriePermission categoriePermission)
        {
            if (id != categoriePermission.Id) return BadRequest();
            _service.Update(categoriePermission);
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