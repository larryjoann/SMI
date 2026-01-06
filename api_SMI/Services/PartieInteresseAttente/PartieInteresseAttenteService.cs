using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class PartieInteresseAttenteService : IPartieInteresseAttenteService
    {
        private readonly PartieInteresseAttenteRepository _repository;

        public PartieInteresseAttenteService(PartieInteresseAttenteRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<PartieInteresseAttente> GetAll() => _repository.GetAll();

        public PartieInteresseAttente? GetById(int id) => _repository.GetById(id);

        public IEnumerable<PartieInteresseAttente> GetByProcessus(int id_processus) => _repository.GetByProcessus(id_processus);

        public void Add(PartieInteresseAttente entity) => _repository.Add(entity);

        public void Update(PartieInteresseAttente entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteByProcessus(int id_processus) => _repository.DeleteByProcessus(id_processus);
    }
}