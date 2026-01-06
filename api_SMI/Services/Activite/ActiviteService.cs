using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class ActiviteService : IActiviteService
    {
        private readonly ActiviteRepository _repository;

        public ActiviteService(ActiviteRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Activite> GetAll() => _repository.GetAll();

        public Activite? GetById(int id) => _repository.GetById(id);

        public IEnumerable<Activite> GetByProcessus(int id_processus) => _repository.GetByProcessus(id_processus);

        public void Add(Activite entity) => _repository.Add(entity);

        public void Update(Activite entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteByProcessus(int id_processus) => _repository.DeleteByProcessus(id_processus);
    }
}