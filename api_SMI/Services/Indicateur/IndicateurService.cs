using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class IndicateurService : IIndicateurService
    {
        private readonly IndicateurRepository _repository;

        public IndicateurService(IndicateurRepository repository)
        {
            _repository = repository;
        }

        public List<Indicateur> GetAll() => _repository.GetAll();

        public Indicateur? GetById(int id) => _repository.GetById(id);

        public void Add(Indicateur indicateur) => _repository.Add(indicateur);

        public void Update(Indicateur indicateur) => _repository.Update(indicateur);

        public void Delete(int id) => _repository.Delete(id);
    }
}