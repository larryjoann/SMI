using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IPlanActionService
    {
        IEnumerable<PlanAction> GetAll();
        PlanAction? GetById(int id);
        void Add(PlanAction planAction);
        void Update(PlanAction planAction);
        void Delete(int id);
    }
}
