using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IObjectifService
    {
        List<Objectif> GetAll();
        Objectif? GetById(int id);
        void Add(Objectif o);
        void Update(Objectif o);
        void Delete(int id);
    }
}