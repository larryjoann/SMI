using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class OperationService : IOperationService
    {
        private readonly OperationRepository _repository;

        public OperationService(OperationRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Operation> GetAll() => _repository.GetAll();

        public Operation? GetById(int id) => _repository.GetById(id);

        public void Add(Operation operation) => _repository.Add(operation);

        public void Update(Operation operation) => _repository.Update(operation);

        public void Delete(int id) => _repository.Delete(id);
    }
}
