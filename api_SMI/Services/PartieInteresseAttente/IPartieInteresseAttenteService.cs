using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IPartieInteresseAttenteService
    {
        IEnumerable<PartieInteresseAttente> GetAll();
        PartieInteresseAttente? GetById(int id);
        IEnumerable<PartieInteresseAttente> GetByProcessus(int id_processus);
        void Add(PartieInteresseAttente entity);
        void Update(PartieInteresseAttente entity);
        void Delete(int id);
        void DeleteByProcessus(int id_processus);
    }
}