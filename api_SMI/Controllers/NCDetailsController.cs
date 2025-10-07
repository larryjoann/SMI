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

        // GET: api/NCDetails/{id}
        [HttpGet("{id}")]
        public IActionResult GetDetails(int id)
        {
            var details = _service.GetDetails(id);
            if (details == null)
                return NotFound();
            return Ok(details);
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

            details.NC.DateTimeCreation = DateTime.Now;
            details.NC.DateTimeDeclare = null;

            _service.Draft(details);
            return CreatedAtAction(nameof(GetDetails), new { id = details.NC.Id }, details);
        }
        
         // POST: api/NCDetails/declare
        [HttpPost("DraftToDeclare/{id}")]
        public IActionResult DraftToDeclare(int id, [FromBody] NCDetails details)
        {
            if (details == null || details.NC == null)
                return BadRequest("Invalid NCDetails data.");

            if (id != details.NC.Id)
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID du corps.");

            details.NC.DateTimeDeclare = DateTime.Now;

            _service.DraftToDeclare(details);

            return Ok(new { id = details.NC.Id });
        }

    }
}