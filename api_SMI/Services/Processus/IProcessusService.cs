using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IProcessusService
    {
        IEnumerable<Processus> GetAll();
        Processus? GetById(int id);
        void Add(Processus processus);
        void Update(Processus processus);
        void Delete(int id);
    }
}