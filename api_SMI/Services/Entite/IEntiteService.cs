using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IEntiteService
    {
        IEnumerable<Entite> GetAll();
        Entite? GetById(int id);
        void Add(Entite entite);
        void Update(Entite entite);
        void Delete(int id);
    }
}
