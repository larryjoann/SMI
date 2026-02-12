using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IMesureIndicateurService
    {
        List<MesureIndicateur> GetAll();
        MesureIndicateur? GetById(int id);
        void Add(MesureIndicateur m);
        void Update(MesureIndicateur m);
        void Delete(int id);
    }
}