using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICategoriePermissionService
    {
        IEnumerable<CategoriePermission> GetAll();
        CategoriePermission? GetById(int id);
        void Add(CategoriePermission categoriePermission);
        void Update(CategoriePermission categoriePermission);
        void Delete(int id);
    }
}