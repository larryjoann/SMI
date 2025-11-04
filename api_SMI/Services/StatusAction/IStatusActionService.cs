using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IStatusActionService
    {
        IEnumerable<StatusAction> GetAll();
        StatusAction? GetById(int id);
        void Add(StatusAction statusAction);
        void Update(StatusAction statusAction);
        void Delete(int id);
    }
}
