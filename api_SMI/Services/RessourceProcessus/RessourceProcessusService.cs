using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class RessourceProcessusService : IRessourceProcessusService
    {
        private readonly RessourceProcessusRepository _repository;

        public RessourceProcessusService(RessourceProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<RessourceProcessus> GetAll() => _repository.GetAll();

        public RessourceProcessus? GetById(int id) => _repository.GetById(id);

        public IEnumerable<RessourceProcessus> GetByProcessus(int id_processus) => _repository.GetByProcessus(id_processus);

        public void Add(RessourceProcessus entity) => _repository.Add(entity);

        public void Update(RessourceProcessus entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteByProcessus(int id_processus) => _repository.DeleteByProcessus(id_processus);
    }
}