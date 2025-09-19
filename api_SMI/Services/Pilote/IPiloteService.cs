using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IPiloteService
    {
        IEnumerable<Pilote> GetAll();
        Pilote? GetById(int id);
        IEnumerable<Pilote> GetByProcessus(int idProcessus);
        void Add(Pilote pilote);
        void Update(Pilote pilote);
        void Delete(int id);
    }
}