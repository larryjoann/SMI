using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ISuiviActionService
    {
        IEnumerable<SuiviAction> GetAll();
        SuiviAction? GetById(int id);
        void Add(SuiviAction suivi);
        void AddRange(List<SuiviAction> suivis);
        void Update(SuiviAction suivi);
        void Delete(int id);
    }
}
