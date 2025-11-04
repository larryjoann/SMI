using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ResponsableActionService : IResponsableActionService
    {
        private readonly ResponsableActionRepository _repository;

        public ResponsableActionService(ResponsableActionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<ResponsableAction> GetAll() => _repository.GetAll();

        public ResponsableAction? GetById(int id) => _repository.GetById(id);

        public void Add(ResponsableAction resp)
        {
            _repository.Add(resp);
        }

        public void Update(ResponsableAction resp)
        {
            _repository.Update(resp);
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }
    }
}
