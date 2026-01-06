using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class CategorieRessourcesService : ICategorieRessourcesService
    {
        private readonly CategorieRessourcesRepository _repository;

        public CategorieRessourcesService(CategorieRessourcesRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<CategorieRessources> GetAll() => _repository.GetAll();

        public CategorieRessources? GetById(int id) => _repository.GetById(id);

        public void Add(CategorieRessources entity) => _repository.Add(entity);

        public void Update(CategorieRessources entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);
    }
}