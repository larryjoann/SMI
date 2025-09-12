using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IPermissionService
    {
        IEnumerable<Permission> GetAll();
        Permission? GetById(int id);
        void Add(Permission permission);
        void Update(Permission permission);
        void Delete(int id);
    }
}