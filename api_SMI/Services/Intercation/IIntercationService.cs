using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IIntercationService
    {
        IEnumerable<Intercation> GetAll();
        Intercation? GetById(int id);
        IEnumerable<Intercation> GetByProcessus(int id_processus);
        void Add(Intercation entity);
        void Update(Intercation entity);
        void Delete(int id);
        void DeleteByProcessus(int id_processus);
    }
}