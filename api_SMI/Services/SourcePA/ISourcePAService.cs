using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ISourcePAService
    {
        IEnumerable<SourcePA> GetAll();
        SourcePA? GetById(int id);
        void Add(SourcePA source);
        void Update(SourcePA source);
        void Delete(int id);
    }
}
