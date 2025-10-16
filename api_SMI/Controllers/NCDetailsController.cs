using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;

namespace api_SMI.Controllers
{
    //[ApiController]
    [Route("api/[controller]")]
    public class NCDetailsController : ControllerBase
    {
        private readonly INCDetailsService _service;

        public NCDetailsController(INCDetailsService service)
        {
            _service = service;
        }

        // GET: api/NCDetails
        [HttpGet]
        public IActionResult GetAll()
        {
            var details = _service.GetAll();
            return Ok(details);
        }

        // GET: api/NCDetails/drafts
        [HttpGet("drafts")]
        public IActionResult GetDrafts()
        {
            var drafts = _service.GetDrafts();
            return Ok(drafts);
        }

        [HttpGet("declare")]
        public IActionResult GetDeclare()
        {
            var drafts = _service.GetDeclare();
            return Ok(drafts);
        }

        // GET: api/NCDetails/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetails(int id)
        {
            var details = _service.GetDetails(id);
            if (details == null)
                return NotFound();
            return Ok(details);
        }

        [HttpPut("archiver/{id}")]
        public IActionResult Archive(int id)
        {
            _service.Archiver(id);
            return NoContent();
        }

        // POST: api/NCDetails/declare
        [HttpPost("declare")]
        public IActionResult Declare([FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            details.NC.DateTimeDeclare = DateTime.Now;
            details.NC.DateTimeCreation = DateTime.Now;

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);

            _service.Declare(details);
            return CreatedAtAction(nameof(GetDetails), new { id = details.NC.Id }, details);
        }

        // POST: api/NCDetails/declare
        [HttpPost("draft")]
        public IActionResult Draft([FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            _service.Draft(details);
            return CreatedAtAction(nameof(GetDetails), new { id = details.NC.Id }, details);
        }

        [HttpPost("DraftToDeclare/{id}")]
        public IActionResult DraftToDeclare(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            details.NC.DateTimeDeclare = DateTime.Now;

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);

            _service.DraftToDeclare(details);

            return Ok(new { id = details.NC.Id });
        }

        [HttpPost("updateDraft/{id}")]
        public IActionResult UpdateDraft(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            _service.Update(details);

            return Ok(new { id = details.NC.Id });
        }

        [HttpPost("updateDeclare/{id}")]
        public IActionResult UpdateDeclare(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            // Force la validation personnalisée
            if (!TryValidateModel(details))
                return BadRequest(ModelState);
            _service.Update(details);

            return Ok(new { id = details.NC.Id });
        }
        
    }
}