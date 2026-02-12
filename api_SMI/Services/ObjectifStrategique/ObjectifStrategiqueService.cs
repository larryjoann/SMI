using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class ObjectifStrategiqueService : IObjectifStrategiqueService
    {
        private readonly ObjectifStrategiqueRepository _repository;

        public ObjectifStrategiqueService(ObjectifStrategiqueRepository repository)
        {
            _repository = repository;
        }

        public List<ObjectifStrategique> GetAll() => _repository.GetAll();

        public ObjectifStrategique? GetById(int id) => _repository.GetById(id);

        public void Add(ObjectifStrategique s) => _repository.Add(s);

        public void Update(ObjectifStrategique s) => _repository.Update(s);

        public void Delete(int id) => _repository.Delete(id);
    }
}