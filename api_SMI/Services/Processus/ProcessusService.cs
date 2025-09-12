using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ProcessusService : IProcessusService
    {
        private readonly ProcessusRepository _repository;

        public ProcessusService(ProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Processus> GetAll() => _repository.GetAll();

        public Processus? GetById(int id) => _repository.GetById(id);

        public void Add(Processus processus) => _repository.Add(processus);

        public void Update(Processus processus) => _repository.Update(processus);

        public void Delete(int id) => _repository.Delete(id);
    }
}