using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly RolePermissionRepository _repository;

        public RolePermissionService(RolePermissionRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<RolePermission> GetAll() => _repository.GetAll();

        public RolePermission? GetById(int id) => _repository.GetById(id);

        public void Add(RolePermission rolePermission) => _repository.Add(rolePermission);

        public void Update(RolePermission rolePermission) => _repository.Update(rolePermission);

        public void Delete(int id) => _repository.Delete(id);
    }
}