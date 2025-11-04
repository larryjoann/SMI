using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using ActionModel = api_SMI.Models.Action;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionController : ControllerBase
    {
        private readonly IActionService _service;

        public ActionController(IActionService service)
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
            var entity = _service.GetById(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }
        [HttpPost]
        public IActionResult Create(ActionModel action)
        {
            _service.Add(action);
            return CreatedAtAction(nameof(GetById), new { id = action.Id }, action);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, ActionModel action)
        {
            Console.WriteLine($"Update déclenché pour Action ID: {id}");
            Console.WriteLine("Données :");
            Console.WriteLine(JsonSerializer.Serialize(action));
            if (id != action.Id) return BadRequest();
            _service.Update(action);
            return NoContent();
        }

        [HttpPatch("{id}/status/{statusId}")]
        public IActionResult UpdateStatus(int id, int statusId)
        {
            Console.WriteLine($"Mise à jour du statut déclenchée pour Action ID: {id} vers le statut ID: {statusId}");
            _service.UpdateStatus(id, statusId);
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
