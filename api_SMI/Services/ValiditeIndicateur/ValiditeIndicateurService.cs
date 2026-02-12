using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class ValiditeIndicateurService : IValiditeIndicateurService
    {
        private readonly ValiditeIndicateurRepository _repository;

        public ValiditeIndicateurService(ValiditeIndicateurRepository repository)
        {
            _repository = repository;
        }

        public List<ValiditeIndicateur> GetAll() => _repository.GetAll();

        public ValiditeIndicateur? GetById(int id) => _repository.GetById(id);

        public void Add(ValiditeIndicateur v) => _repository.Add(v);

        public void Update(ValiditeIndicateur v) => _repository.Update(v);

        public void Delete(int id) => _repository.Delete(id);
    }
}