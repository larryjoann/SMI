using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class RoleCollaborateurService : IRoleCollaborateurService
    {
        private readonly RoleCollaborateurRepository _repository;

        public RoleCollaborateurService(RoleCollaborateurRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<RoleCollaborateur> GetAll() => _repository.GetAll();

        public RoleCollaborateur? GetById(int id) => _repository.GetById(id);

        public void Add(RoleCollaborateur roleCollaborateur) => _repository.Add(roleCollaborateur);

        public void Update(RoleCollaborateur roleCollaborateur) => _repository.Update(roleCollaborateur);

        public void Delete(int id) => _repository.Delete(id);
    }
}