using api_SMI.Models;
using StatusActionModel = api_SMI.Models.StatusAction;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class StatusActionService : IStatusActionService
    {
        private readonly StatusActionRepository _repository;

        public StatusActionService(StatusActionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<StatusActionModel> GetAll() => _repository.GetAll();

        public StatusActionModel? GetById(int id) => _repository.GetById(id);

        public void Add(StatusActionModel statusAction) => _repository.Add(statusAction);

        public void Update(StatusActionModel statusAction) => _repository.Update(statusAction);

        public void Delete(int id) => _repository.Delete(id);
    }
}
