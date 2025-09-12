using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IRoleCollaborateurService
    {
        IEnumerable<RoleCollaborateur> GetAll();
        RoleCollaborateur? GetById(int id);
        void Add(RoleCollaborateur roleCollaborateur);
        void Update(RoleCollaborateur roleCollaborateur);
        void Delete(int id);
    }
}