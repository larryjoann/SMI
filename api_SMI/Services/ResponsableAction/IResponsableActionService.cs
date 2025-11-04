using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IResponsableActionService
    {
        IEnumerable<ResponsableAction> GetAll();
        ResponsableAction? GetById(int id);
        void Add(ResponsableAction resp);
        void Update(ResponsableAction resp);
        void Delete(int id);
    }
}
