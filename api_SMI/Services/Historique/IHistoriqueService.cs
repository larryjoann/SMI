using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IHistoriqueService
    {
        IEnumerable<Historique> GetAll();
        Historique? GetById(int id);
        void Add(Historique historique);
        void Update(Historique historique);
        void Delete(int id);
        List<Historique> GetByEntiteAndIdObject(int idEntite, int idObject);
    }
}
