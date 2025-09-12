using api_SMI.Models;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Threading.Tasks;

namespace api_SMI.Services
{
    public interface ICollaborateurService
    {
    List<Collaborateur> GetAll();
    Collaborateur? GetByMatricule(string matricule);
    void Add(Collaborateur collaborateur);
    void AddRange(List<Collaborateur> collaborateurs); 
    void Update(Collaborateur collaborateur);
    void Delete(string matricule);

    List<Collaborateur> GetAllADCollaborateurFromAD();
    }
}
