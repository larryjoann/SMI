using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IActionService
    {
        IEnumerable<api_SMI.Models.Action> GetAll();
        api_SMI.Models.Action? GetById(int id);
        IEnumerable<api_SMI.Models.Action> GetByEntite(int entiteId);
        IEnumerable<api_SMI.Models.Action> GetByEntiteAndObject(int entiteId, int objetId);
        void Add(api_SMI.Models.Action action);
        void Update(api_SMI.Models.Action action);
        void UpdateStatus(int idAction, int statusId);
        void Delete(int id);
        
    }
}
