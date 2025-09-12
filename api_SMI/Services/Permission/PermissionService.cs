using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly PermissionRepository _repository;

        public PermissionService(PermissionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Permission> GetAll() => _repository.GetAll();

        public Permission? GetById(int id) => _repository.GetById(id);

        public void Add(Permission permission) => _repository.Add(permission);

        public void Update(Permission permission) => _repository.Update(permission);

        public void Delete(int id) => _repository.Delete(id);
    }
}