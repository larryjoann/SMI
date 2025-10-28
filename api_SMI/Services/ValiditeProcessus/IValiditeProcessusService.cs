using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IValiditeProcessusService
    {
        IEnumerable<ValiditeProcessus> GetAll();
        ValiditeProcessus? GetById(int id);
        IEnumerable<ValiditeProcessus> GetByProcessus(int id_processus);
        void Add(ValiditeProcessus entity);
        void Update(ValiditeProcessus entity);
        void Delete(int id);
        void DeleteByProcessus(int id_processus);
    }
}
