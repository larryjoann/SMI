using api_SMI.Models;
using api_SMI.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Linq;
using ActionModel = api_SMI.Models.Action;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActionDetailsController : ControllerBase
    {
        private readonly IActionService _actionService;
        private readonly ISuiviActionService _suiviService;
        private readonly ISourceActionService _sourceService;
        private readonly IResponsableActionService _responsableService;

        public ActionDetailsController(
            IActionService actionService,
            ISuiviActionService suiviService,
            ISourceActionService sourceService,
            IResponsableActionService responsableService
            )
        {
            _actionService = actionService;
            _suiviService = suiviService;
            _sourceService = sourceService;
            _responsableService = responsableService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_actionService.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var entity = _actionService.GetById(id);
            if (entity == null) return NotFound();
            return Ok(entity);
        }
        [HttpPost]
        public IActionResult Create([FromForm] string ActionDetails)
        {
            if (string.IsNullOrWhiteSpace(ActionDetails))
                return BadRequest("ActionDetails form field is required.");
            Console.WriteLine("Données reçues dans ActionDetails:");
            Console.WriteLine(ActionDetails);

            try
            {
                var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                // Try to deserialize directly into the Action model (maps title/descr/dates/idStatusAction and sources if names match)
                var incoming = System.Text.Json.JsonSerializer.Deserialize<ActionModel>(ActionDetails, options);
                if (incoming == null)
                    return BadRequest("Unable to parse ActionDetails into Action model.");
                Console.WriteLine("Données dans action apres deserialize:");
                Console.WriteLine(JsonSerializer.Serialize(incoming));

                // Map the deserialized model into a new Action entity instance
                api_SMI.Models.Action actionEntity = new api_SMI.Models.Action
                {
                    Titre = incoming.Titre,
                    Descr = incoming.Descr,
                    DateDebut = incoming.DateDebut,
                    DateFinPrevue = incoming.DateFinPrevue,
                    DateFinReelle = incoming.DateFinReelle,
                    IdStatusAction = incoming.IdStatusAction,
                    Status = true
                };
                _actionService.Add(actionEntity);

                List<SourceAction> sourcesToAdd = new List<SourceAction>();
                if (incoming.Sources != null && incoming.Sources.Count > 0)
                {
                    foreach (var src in incoming.Sources)
                    {
                        var source = new SourceAction
                        {
                            IdAction = actionEntity.Id,
                            IdEntite = src.IdEntite,
                            IdObjet = src.IdObjet
                        };
                        sourcesToAdd.Add(source);
                    }
                    foreach (var source in sourcesToAdd)
                    {
                        _sourceService.Add(source);
                    }
                }

                //Map and persist responsables (if any) using the created action's Id
                List<ResponsableAction> responsablesToAdd = new List<ResponsableAction>();
                if (incoming.Responsables != null && incoming.Responsables.Count > 0)
                {
                    foreach (var r in incoming.Responsables)
                    {
                        var resp = new ResponsableAction
                        {
                            IdAction = actionEntity.Id,
                            MatriculeAssignateur = r.MatriculeResponsable,
                            MatriculeResponsable = r.MatriculeResponsable
                        };
                        responsablesToAdd.Add(resp);
                    }

                    foreach (var resp in responsablesToAdd)
                    {
                        _responsableService.Add(resp);
                    }
                }
                Console.WriteLine("Liste responsable:");
                Console.WriteLine(JsonSerializer.Serialize(incoming.Responsables));
                return Ok();
                // Persist the new action (service expects a Models.Action)
                //_actionService.Add(actionEntity);
                //return CreatedAtAction(nameof(GetById), new { id = actionEntity.Id }, actionEntity);
            }
            catch (System.Text.Json.JsonException jex)
            {
                return BadRequest("Invalid JSON in ActionDetails: " + jex.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, ex.Message);
            }
        }
        
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromForm] string ActionDetails)
        {
            if (string.IsNullOrWhiteSpace(ActionDetails))
                return BadRequest("ActionDetails form field is required.");

            Console.WriteLine($"Update déclenché pour Action ID: {id}");
            Console.WriteLine("Données reçues (raw):");
            Console.WriteLine(ActionDetails);

            try
            {
                var options = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var incoming = System.Text.Json.JsonSerializer.Deserialize<ActionModel>(ActionDetails, options);
                if (incoming == null)
                    return BadRequest("Unable to parse ActionDetails into Action model.");

                // Load existing action
                var existing = _actionService.GetById(id);
                if (existing == null) return NotFound();

                // Map updatable fields
                existing.Titre = incoming.Titre;
                existing.Descr = incoming.Descr;
                existing.DateDebut = incoming.DateDebut;
                existing.DateFinPrevue = incoming.DateFinPrevue;
                existing.DateFinReelle = incoming.DateFinReelle;
                existing.IdStatusAction = incoming.IdStatusAction;

                _actionService.Update(existing);

                // Replace sources: delete existing ones for this action, then add incoming
                // var existingSources = _sourceService.GetAll().Where(s => s.IdAction == id).ToList();
                // foreach (var s in existingSources)
                // {
                //     _sourceService.Delete(s.Id);
                // }

                // if (incoming.Sources != null && incoming.Sources.Count > 0)
                // {
                //     foreach (var src in incoming.Sources)
                //     {
                //         var source = new SourceAction
                //         {
                //             IdAction = existing.Id,
                //             IdEntite = src.IdEntite,
                //             IdObjet = src.IdObjet
                //         };
                //         _sourceService.Add(source);
                //     }
                // }

                // Replace responsables similarly
                var existingResps = _responsableService.GetAll().Where(r => r.IdAction == id).ToList();
                foreach (var r in existingResps)
                {
                    _responsableService.Delete(r.Id);
                }

                if (incoming.Responsables != null && incoming.Responsables.Count > 0)
                {
                    foreach (var r in incoming.Responsables)
                    {
                        var resp = new ResponsableAction
                        {
                            IdAction = existing.Id,
                            MatriculeAssignateur = r.MatriculeResponsable,
                            MatriculeResponsable = r.MatriculeResponsable
                        };
                        _responsableService.Add(resp);
                    }
                }

                Console.WriteLine("Update completed for action and related entities.");
                return NoContent();
            }
            catch (System.Text.Json.JsonException jex)
            {
                return BadRequest("Invalid JSON in ActionDetails: " + jex.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, ex.Message);
            }
        }      

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _actionService.Delete(id);
            return NoContent();
        }
    }
}
