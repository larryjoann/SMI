using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class LieuService : ILieuService
    {
        private readonly LieuRepository _repository;

        public LieuService(LieuRepository repository)
        {
            _repository = repository;
        }

        public List<Lieu> GetAll() => _repository.GetAll();

        public Lieu? GetById(int id) => _repository.GetById(id);

        public void Add(Lieu lieu) => _repository.Add(lieu);

        public void AddRange(List<Lieu> lieux) => _repository.AddRange(lieux);

        public void Update(Lieu lieu) => _repository.Update(lieu);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();
    }
}