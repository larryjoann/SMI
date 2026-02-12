using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class CibleIndicateurService : ICibleIndicateurService
    {
        private readonly CibleIndicateurRepository _repository;

        public CibleIndicateurService(CibleIndicateurRepository repository)
        {
            _repository = repository;
        }

        public List<CibleIndicateur> GetAll() => _repository.GetAll();

        public CibleIndicateur? GetById(int id) => _repository.GetById(id);

        public void Add(CibleIndicateur cibleIndicateur) => _repository.Add(cibleIndicateur);

        public void Update(CibleIndicateur cibleIndicateur) => _repository.Update(cibleIndicateur);

        public void Delete(int id) => _repository.Delete(id);
    }
}
