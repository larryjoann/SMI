using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IOperationService
    {
        IEnumerable<Operation> GetAll();
        Operation? GetById(int id);
        void Add(Operation operation);
        void Update(Operation operation);
        void Delete(int id);
    }
}
