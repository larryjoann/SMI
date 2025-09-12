using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICategorieProcessusService
    {
        IEnumerable<CategorieProcessus> GetAll();
        CategorieProcessus? GetById(int id);
        void Add(CategorieProcessus categorie);
        void Update(CategorieProcessus categorie);
        void Delete(int id);
    }
}