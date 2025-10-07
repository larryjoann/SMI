using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LieuController : ControllerBase
    {
        private readonly ILieuService _service;

        public LieuController(ILieuService service)
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
            var lieu = _service.GetById(id);
            if (lieu == null) return NotFound();
            return Ok(lieu);
        }

        [HttpPost]
        public IActionResult Create(Lieu lieu)
        {
            _service.Add(lieu);
            return CreatedAtAction(nameof(GetById), new { id = lieu.Id }, lieu);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Lieu lieu)
        {
            if (id != lieu.Id) return BadRequest();
            _service.Update(lieu);
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