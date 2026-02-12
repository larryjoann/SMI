using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IIndicateurService
    {
        List<Indicateur> GetAll();
        Indicateur? GetById(int id);
        void Add(Indicateur indicateur);
        void Update(Indicateur indicateur);
        void Delete(int id);
    }
}