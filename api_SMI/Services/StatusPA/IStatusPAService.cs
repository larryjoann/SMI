using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IStatusPAService
    {
        IEnumerable<StatusPA> GetAll();
        StatusPA? GetById(int id);
        void Add(StatusPA status);
        void Update(StatusPA status);
        void Delete(int id);
    }
}
