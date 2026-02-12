using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface ICibleIndicateurService
    {
        List<CibleIndicateur> GetAll();
        CibleIndicateur? GetById(int id);
        void Add(CibleIndicateur cibleIndicateur);
        void Update(CibleIndicateur cibleIndicateur);
        void Delete(int id);
    }
}
