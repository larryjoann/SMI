using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolePermissionController : ControllerBase
    {
        private readonly RolePermissionService _service;

        public RolePermissionController(RolePermissionService service)
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
            var rolePermission = _service.GetById(id);
            if (rolePermission == null) return NotFound();
            return Ok(rolePermission);
        }

        [HttpPost]
        public IActionResult Create(RolePermission rolePermission)
        {
            _service.Add(rolePermission);
            return CreatedAtAction(nameof(GetById), new { id = rolePermission.Id }, rolePermission);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, RolePermission rolePermission)
        {
            if (id != rolePermission.Id) return BadRequest();
            _service.Update(rolePermission);
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