using api_SMI.Models;
using api_SMI.Repositories;
using api_SMI.Services;
using api_SMI.Ldap; // Ajoute ce using pour accéder à ILdapService/LdapService
using System.Data.SqlClient;
using System.Security.Claims;
using System.DirectoryServices;
using System.Text;
using System.Text.RegularExpressions;

namespace api_SMI.Services
{
    public class CollaborateurService : ICollaborateurService
    {
        private readonly CollaborateurRepository _repository;
        private readonly ILdapService _ldapService;

        public CollaborateurService(CollaborateurRepository repository, ILdapService ldapService)
        {
            _repository = repository;
            _ldapService = ldapService;
        }

        public List<Collaborateur> GetAll() => _repository.GetAll();
      
        public Collaborateur? GetByMatricule(string matricule) => _repository.GetByMatricule(matricule);
        public void Add(Collaborateur collaborateur) => _repository.Add(collaborateur);
        public void AddRange(List<Collaborateur> collaborateurs)
        {
            _repository.AddRange(collaborateurs);
        }
        public void Update(Collaborateur collaborateur) => _repository.Update(collaborateur);
        public void Delete(string matricule) => _repository.Delete(matricule);

        public List<Collaborateur> GetAllADCollaborateurFromAD()
        {
            string domainPath = "LDAP://corp.ravinala";
            return _ldapService.GetCollaborateursFromActiveDirectory(domainPath);
        }
        
        public void ImportAllADCollaborateurs()
        {
            var collaborateurs = GetAllADCollaborateurFromAD();
            _repository.DeleteAll();
            if (collaborateurs != null && collaborateurs.Count > 0)
            {
                AddRange(collaborateurs);
            }
        }
    }
}