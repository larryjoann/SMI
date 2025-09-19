using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class PiloteService : IPiloteService
    {
        private readonly PiloteRepository _repository;

        public PiloteService(PiloteRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Pilote> GetAll() => _repository.GetAll();

        public Pilote? GetById(int id) => _repository.GetById(id);

        public IEnumerable<Pilote> GetByProcessus(int idProcessus) => _repository.GetByProcessus(idProcessus);

        public void Add(Pilote pilote) => _repository.Add(pilote);

        public void Update(Pilote pilote) => _repository.Update(pilote);

        public void Delete(int id) => _repository.Delete(id);
    }
}