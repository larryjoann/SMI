using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CopiloteService : ICopiloteService
    {
        private readonly CopiloteRepository _repository;

        public CopiloteService(CopiloteRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Copilote> GetAll() => _repository.GetAll();

        public Copilote? GetById(int id) => _repository.GetById(id);

        public IEnumerable<Copilote> GetByProcessus(int idProcessus) => _repository.GetByProcessus(idProcessus);

        public void Add(Copilote copilote) => _repository.Add(copilote);

        public void Update(Copilote copilote) => _repository.Update(copilote);

        public void Delete(int id) => _repository.Delete(id);
    }
}