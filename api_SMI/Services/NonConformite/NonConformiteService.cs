using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class NonConformiteService : INonConformiteService
    {
        private readonly NonConformiteRepository _repository;

        public NonConformiteService(NonConformiteRepository repository)
        {
            _repository = repository;
        }

        public List<NonConformite> GetAll() => _repository.GetAll();

        public NonConformite? GetById(int id) => _repository.GetById(id);

        public void Declare(NonConformite nonConformite)
        {
            _repository.Add(nonConformite);
        }

        public void Draft(NonConformite nonConformite)
        {
            _repository.Add(nonConformite);
        }

        public void DraftToDeclare(NonConformite nonConformite)
        {
            nonConformite.DateTimeDeclare = DateTime.Now; 
            _repository.Update(nonConformite);
        }

        public void AddRange(List<NonConformite> nonConformiteList) => _repository.AddRange(nonConformiteList);

        public void Update(NonConformite nonConformite) => _repository.Update(nonConformite);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();

        public List<NonConformite> GetDrafts() => _repository.GetDrafts();
    }
}