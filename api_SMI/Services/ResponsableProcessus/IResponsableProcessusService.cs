using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IResponsableProcessusService
    {
        IEnumerable<ResponsableProcessus> GetAll();
        ResponsableProcessus? GetById(int id);
        IEnumerable<ResponsableProcessus> GetByProcessus(int idProcessus);
        IEnumerable<ResponsableProcessus> GetByCollaborateur(string matriculeCollaborateur);
        IEnumerable<ResponsableProcessus> GetByType(int idTypeResponsableProcessus);
        IEnumerable<ResponsableProcessus> GetByProcessusAndType(int idProcessus, int idTypeResponsableProcessus);
        void Add(ResponsableProcessus responsableProcessus);
        void Update(ResponsableProcessus responsableProcessus);
        void Delete(int id);
    }
}
