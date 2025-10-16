using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class PhaseNcService : IPhaseNcService
    {
        private readonly PhaseNcRepository _repository;

        public PhaseNcService(PhaseNcRepository repository)
        {
            _repository = repository;
        }

        public List<PhaseNc> GetAll() => _repository.GetAll();

        public PhaseNc? GetById(int id) => _repository.GetById(id);

        public void Add(PhaseNc entity) => _repository.Add(entity);

        public void Update(PhaseNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);
    }
}
