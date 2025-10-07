using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class PrioriteNcService : IPrioriteNcService
    {
        private readonly PrioriteNcRepository _repository;

        public PrioriteNcService(PrioriteNcRepository repository)
        {
            _repository = repository;
        }

        public List<PrioriteNc> GetAll() => _repository.GetAll();

        public PrioriteNc? GetById(int id) => _repository.GetById(id);

        public void Add(PrioriteNc entity) => _repository.Add(entity);

        public void Update(PrioriteNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);
    }
}