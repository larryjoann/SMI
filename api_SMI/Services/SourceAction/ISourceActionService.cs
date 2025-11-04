using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ISourceActionService
    {
        IEnumerable<SourceAction> GetAll();
        SourceAction? GetById(int id);
        void Add(SourceAction source);
        void AddRange(IEnumerable<SourceAction> sources);
        void Update(SourceAction source);
        void Delete(int id);
    }
}
