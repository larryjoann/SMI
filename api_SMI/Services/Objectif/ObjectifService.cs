using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class ObjectifService : IObjectifService
    {
        private readonly ObjectifRepository _repository;

        public ObjectifService(ObjectifRepository repository)
        {
            _repository = repository;
        }

        public List<Objectif> GetAll() => _repository.GetAll();

        public Objectif? GetById(int id) => _repository.GetById(id);

        public void Add(Objectif o) => _repository.Add(o);

        public void Update(Objectif o) => _repository.Update(o);

        public void Delete(int id) => _repository.Delete(id);
    }
}