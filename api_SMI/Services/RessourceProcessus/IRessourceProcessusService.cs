using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IRessourceProcessusService
    {
        IEnumerable<RessourceProcessus> GetAll();
        RessourceProcessus? GetById(int id);
        IEnumerable<RessourceProcessus> GetByProcessus(int id_processus);
        void Add(RessourceProcessus entity);
        void Update(RessourceProcessus entity);
        void Delete(int id);
        void DeleteByProcessus(int id_processus);
    }
}