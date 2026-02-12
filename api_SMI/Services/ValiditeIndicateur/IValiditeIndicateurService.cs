using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IValiditeIndicateurService
    {
        List<ValiditeIndicateur> GetAll();
        ValiditeIndicateur? GetById(int id);
        void Add(ValiditeIndicateur v);
        void Update(ValiditeIndicateur v);
        void Delete(int id);
    }
}