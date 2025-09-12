using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IRoleService
    {
        IEnumerable<Role> GetAll();
        Role? GetById(int id);
        void Add(Role role);
        void Update(Role role);
        void Delete(int id);
    }
}