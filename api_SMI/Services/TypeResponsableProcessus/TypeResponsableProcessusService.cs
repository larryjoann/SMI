using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class TypeResponsableProcessusService : ITypeResponsableProcessusService
    {
        private readonly TypeResponsableProcessusRepository _repository;

        public TypeResponsableProcessusService(TypeResponsableProcessusRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<TypeResponsableProcessus> GetAll() => _repository.GetAll();

        public TypeResponsableProcessus? GetById(int id) => _repository.GetById(id);

        public IEnumerable<TypeResponsableProcessus> GetByRole(int idRole) => _repository.GetByRole(idRole);

        public void Add(TypeResponsableProcessus typeResponsableProcessus) => _repository.Add(typeResponsableProcessus);

        public void Update(TypeResponsableProcessus typeResponsableProcessus) => _repository.Update(typeResponsableProcessus);

        public void Delete(int id) => _repository.Delete(id);
    }
}
