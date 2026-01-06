using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class IntercationService : IIntercationService
    {
        private readonly IntercationRepository _repository;

        public IntercationService(IntercationRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Intercation> GetAll() => _repository.GetAll();

        public Intercation? GetById(int id) => _repository.GetById(id);

        public IEnumerable<Intercation> GetByProcessus(int id_processus) => _repository.GetByProcessus(id_processus);

        public void Add(Intercation entity) => _repository.Add(entity);

        public void Update(Intercation entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteByProcessus(int id_processus) => _repository.DeleteByProcessus(id_processus);
    }
}