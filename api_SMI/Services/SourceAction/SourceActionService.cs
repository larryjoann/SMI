using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace api_SMI.Services
{
    public class SourceActionService : ISourceActionService
    {
    private readonly SourceActionRepository _repository;
    private readonly ActionRepository _actionRepository;
    private readonly IPlanActionService _planActionService;
    private readonly INonConformiteService _nonConformiteService;

        public SourceActionService(SourceActionRepository repository, ActionRepository actionRepository, IPlanActionService planActionService, INonConformiteService nonConformiteService)
        {
            _repository = repository;
            _actionRepository = actionRepository;
            _planActionService = planActionService;
            _nonConformiteService = nonConformiteService;
        }

        public IEnumerable<SourceAction> GetAll() => _repository.GetAll();

        public SourceAction? GetById(int id) => _repository.GetById(id);

        public void Add(SourceAction source)
        {
            _repository.Add(source);
            if (source.IdEntite == 2 && source.IdObjet.HasValue) // Entite 2 corresponds to NonConformite
            {
                NonConformite? nc = _nonConformiteService.GetById(source.IdObjet.Value);
                if (nc != null)
                {
                    nc.IdStatusNc = 6; // Update status to "In Progress"
                    _nonConformiteService.Update(nc);
                }
            }
            if (source.IdEntite == 3 && source.IdObjet.HasValue) // Entite 3 corresponds to PlanAction
            {
                PlanAction? pa = _planActionService.GetById(source.IdObjet.Value);
                if (pa != null)
                {
                    pa.IdStatusPA = 2; // Activate the plan action
                    _planActionService.Update(pa);
                }
            }
        }

        public void AddRange(IEnumerable<SourceAction> sources)
        {
            foreach (SourceAction source in sources)
            {
                Add(source);
            }
        }

        public void Update(SourceAction source)
        {
            _repository.Update(source);
        }

        public void Delete(int id)
        {
            // Get the source; if missing, nothing to do
            SourceAction? source = _repository.GetById(id);
            if (source == null)
            {
                // Could return or throw; choose to return silently to match idempotent delete
                return;
            }

            // Get the related action; if not found, just delete the source
            api_SMI.Models.Action? action = _actionRepository.GetById(source.IdAction);
            if (action != null)
            {
                // Protect against null Sources collection
                var sources = action.Sources ?? new System.Collections.Generic.List<SourceAction>();
                if (sources.Count <= 1)
                {
                    action.Status = false;
                    _actionRepository.Update(action);
                }
            }

            _repository.Delete(id);

        }
    }
}
