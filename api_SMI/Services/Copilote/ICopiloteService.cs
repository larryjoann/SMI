using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICopiloteService
    {
        IEnumerable<Copilote> GetAll();
        Copilote? GetById(int id);
        IEnumerable<Copilote> GetByProcessus(int idProcessus);
        void Add(Copilote copilote);
        void Update(Copilote copilote);
        void Delete(int id);
    }
}