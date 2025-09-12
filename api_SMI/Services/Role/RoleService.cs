using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class RoleService : IRoleService
    {
        private readonly RoleRepository _repository;

        public RoleService(RoleRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Role> GetAll() => _repository.GetAll();

        public Role? GetById(int id) => _repository.GetById(id);

        public void Add(Role role) => _repository.Add(role);

        public void Update(Role role) => _repository.Update(role);

        public void Delete(int id) => _repository.Delete(id);
    }
}