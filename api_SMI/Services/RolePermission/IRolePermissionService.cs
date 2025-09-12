using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IRolePermissionService
    {
        IEnumerable<RolePermission> GetAll();
        RolePermission? GetById(int id);
        void Add(RolePermission rolePermission);
        void Update(RolePermission rolePermission);
        void Delete(int id);
    }
}