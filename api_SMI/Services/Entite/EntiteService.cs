using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class EntiteService : IEntiteService
    {
        private readonly EntiteRepository _repository;

        public EntiteService(EntiteRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Entite> GetAll() => _repository.GetAll();

        public Entite? GetById(int id) => _repository.GetById(id);

        public void Add(Entite entite) => _repository.Add(entite);

        public void Update(Entite entite) => _repository.Update(entite);

        public void Delete(int id) => _repository.Delete(id);
    }
}
