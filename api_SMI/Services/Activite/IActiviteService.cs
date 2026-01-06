using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IActiviteService
    {
        IEnumerable<Activite> GetAll();
        Activite? GetById(int id);
        IEnumerable<Activite> GetByProcessus(int id_processus);
        void Add(Activite entity);
        void Update(Activite entity);
        void Delete(int id);
        void DeleteByProcessus(int id_processus);
    }
}