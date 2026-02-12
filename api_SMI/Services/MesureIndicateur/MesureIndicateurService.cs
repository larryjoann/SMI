using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class MesureIndicateurService : IMesureIndicateurService
    {
        private readonly MesureIndicateurRepository _repository;

        public MesureIndicateurService(MesureIndicateurRepository repository)
        {
            _repository = repository;
        }

        public List<MesureIndicateur> GetAll() => _repository.GetAll();

        public MesureIndicateur? GetById(int id) => _repository.GetById(id);

        public void Add(MesureIndicateur m) => _repository.Add(m);

        public void Update(MesureIndicateur m) => _repository.Update(m);

        public void Delete(int id) => _repository.Delete(id);
    }
}