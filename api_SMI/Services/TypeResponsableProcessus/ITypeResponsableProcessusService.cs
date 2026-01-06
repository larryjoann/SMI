using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ITypeResponsableProcessusService
    {
        IEnumerable<TypeResponsableProcessus> GetAll();
        TypeResponsableProcessus? GetById(int id);
        IEnumerable<TypeResponsableProcessus> GetByRole(int idRole);
        void Add(TypeResponsableProcessus typeResponsableProcessus);
        void Update(TypeResponsableProcessus typeResponsableProcessus);
        void Delete(int id);
    }
}
