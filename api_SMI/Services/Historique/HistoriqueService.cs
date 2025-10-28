using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class HistoriqueService : IHistoriqueService
    {
        private readonly HistoriqueRepository _repository;

        public HistoriqueService(HistoriqueRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Historique> GetAll() => _repository.GetAll();

        public Historique? GetById(int id) => _repository.GetById(id);

        public void Add(Historique historique) => _repository.Add(historique);

        public void Update(Historique historique) => _repository.Update(historique);

        public void Delete(int id) => _repository.Delete(id);

        public List<Historique> GetByEntiteAndIdObject(int idEntite, int idObject)
            => _repository.GetByEntiteAndIdObject(idEntite, idObject);
    }
}
