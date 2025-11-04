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

        public SourceActionService(SourceActionRepository repository, ActionRepository actionRepository)
        {
            _repository = repository;
            _actionRepository = actionRepository;
        }

        public IEnumerable<SourceAction> GetAll() => _repository.GetAll();

        public SourceAction? GetById(int id) => _repository.GetById(id);

        public void Add(SourceAction source)
        {
            _repository.Add(source);
        }

        public void AddRange(IEnumerable<SourceAction> sources)
        {
            // repository expects a List<SourceAction>
            _repository.AddRange(sources.ToList());
        }

        public void Update(SourceAction source)
        {
            _repository.Update(source);
        }

        public void Delete(int id)
        {
            // Get the source; if missing, nothing to do
            SourceAction source = _repository.GetById(id);
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
