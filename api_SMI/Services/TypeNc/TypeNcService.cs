using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class TypeNcService : ITypeNcService
    {
        private readonly TypeNcRepository _repository;

        public TypeNcService(TypeNcRepository repository)
        {
            _repository = repository;
        }

        public List<TypeNc> GetAll() => _repository.GetAll();

        public TypeNc? GetById(int id) => _repository.GetById(id);

        public void Add(TypeNc typeNc) => _repository.Add(typeNc);

        public void AddRange(List<TypeNc> typeNcs) => _repository.AddRange(typeNcs);

        public void Update(TypeNc typeNc) => _repository.Update(typeNc);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();
    }
}