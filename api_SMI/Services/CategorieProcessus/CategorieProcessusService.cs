using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CategorieProcessusService : ICategorieProcessusService
    {
        private readonly CategorieProcessusRepository _repository;

        public CategorieProcessusService(CategorieProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<CategorieProcessus> GetAll() => _repository.GetAll();

        public CategorieProcessus? GetById(int id) => _repository.GetById(id);

        public void Add(CategorieProcessus categorie) => _repository.Add(categorie);

        public void Update(CategorieProcessus categorie) => _repository.Update(categorie);

        public void Delete(int id) => _repository.Delete(id);
    }
}