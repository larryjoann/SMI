using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CategoriePermissionService : ICategoriePermissionService
    {
        private readonly CategoriePermissionRepository _repository;

        public CategoriePermissionService(CategoriePermissionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<CategoriePermission> GetAll() => _repository.GetAll();

        public CategoriePermission? GetById(int id) => _repository.GetById(id);

        public void Add(CategoriePermission categoriePermission) => _repository.Add(categoriePermission);

        public void Update(CategoriePermission categoriePermission) => _repository.Update(categoriePermission);

        public void Delete(int id) => _repository.Delete(id);
    }
}