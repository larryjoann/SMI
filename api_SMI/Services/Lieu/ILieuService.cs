using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ILieuService
    {
        List<Lieu> GetAll();
        Lieu? GetById(int id);
        void Add(Lieu lieu);
        void AddRange(List<Lieu> lieux);
        void Update(Lieu lieu);
        void Delete(int id);
        void DeleteAll();
    }
}