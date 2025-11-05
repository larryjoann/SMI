using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IProcessusConcernePAService
    {
        IEnumerable<ProcessusConcernePA> GetAll();
        ProcessusConcernePA? GetById(int id);
        void Add(ProcessusConcernePA pc);
        void Update(ProcessusConcernePA pc);
        void Delete(int id);
    }
}
