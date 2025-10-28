using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class ValiditeProcessusService : IValiditeProcessusService
    {
        private readonly ValiditeProcessusRepository _repository;

        public ValiditeProcessusService(ValiditeProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<ValiditeProcessus> GetAll() => _repository.GetAll();

        public ValiditeProcessus? GetById(int id) => _repository.GetById(id);

        public IEnumerable<ValiditeProcessus> GetByProcessus(int id_processus) => _repository.GetByProcessus(id_processus);

        public void Add(ValiditeProcessus entity) => _repository.Add(entity);

        public void Update(ValiditeProcessus entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteByProcessus(int id_processus) => _repository.DeleteByProcessus(id_processus);
    }
}
