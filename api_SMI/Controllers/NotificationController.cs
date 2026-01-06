using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api_SMI.Extensions;
using System.Linq;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationController(INotificationService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_service.GetAll());
        }

        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var entity = _service.GetById(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Notification notification)
        {
            if (notification == null) return BadRequest("Notification is null.");
            _service.Add(notification);
            return CreatedAtAction(nameof(GetById), new { id = notification.Id }, notification);
        }

        [HttpGet("by-collaborator")]
        public IActionResult GetByCollaborator()
        {
            var matricule = User.GetMatricule();
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            
            var notifications = _service.GetByCollaborator(matricule).ToList();

            return Ok(notifications);
        }

        [HttpGet("mark-all-read")]
        public IActionResult MarkAllAsRead()
        {
            var matricule = User.GetMatricule();
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }

            _service.MarkAllAsReadByCollaborator(matricule);
            return NoContent();
        }

        [HttpGet("unread")]
        public IActionResult GetUnreadByCollaborator()
        {
            var matricule = User.GetMatricule();
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            return Ok(_service.GetUnreadByCollaborator(matricule));
        }

        [HttpGet("unread-count")]
        public IActionResult GetUnreadCount()
        {
            var matricule = User.GetMatricule();
            if (string.IsNullOrEmpty(matricule))
            {
                return Unauthorized(new { message = "Aucune session active ou matricule absent." });
            }
            var count = _service.GetUnreadCountByCollaborator(matricule);
            return Ok(new { unread = count });
        }

        [HttpGet("by-entity/{idEntite}/{idObject}")]
        public IActionResult GetByEntityObject(int idEntite, int idObject)
        {
            return Ok(_service.GetByEntityObject(idEntite, idObject));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Notification notification)
        {
            if (notification == null || id != notification.Id) return BadRequest();
            _service.Update(notification);
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
