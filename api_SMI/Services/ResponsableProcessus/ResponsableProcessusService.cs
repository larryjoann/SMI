using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ResponsableProcessusService : IResponsableProcessusService
    {
        private readonly ResponsableProcessusRepository _repository;

        public ResponsableProcessusService(ResponsableProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<ResponsableProcessus> GetAll() => _repository.GetAll();

        public ResponsableProcessus? GetById(int id) => _repository.GetById(id);

        public IEnumerable<ResponsableProcessus> GetByProcessus(int idProcessus) => _repository.GetByProcessus(idProcessus);

        public IEnumerable<ResponsableProcessus> GetByCollaborateur(string matriculeCollaborateur) => _repository.GetByCollaborateur(matriculeCollaborateur);

        public IEnumerable<ResponsableProcessus> GetByType(int idTypeResponsableProcessus) => _repository.GetByType(idTypeResponsableProcessus);

        public IEnumerable<ResponsableProcessus> GetByProcessusAndType(int idProcessus, int idTypeResponsableProcessus) => 
            _repository.GetByProcessusAndType(idProcessus, idTypeResponsableProcessus);

        public void Add(ResponsableProcessus responsableProcessus) => _repository.Add(responsableProcessus);

        public void Update(ResponsableProcessus responsableProcessus) => _repository.Update(responsableProcessus);

        public void Delete(int id) => _repository.Delete(id);
    }
}
