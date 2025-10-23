using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICauseNcService
    {
        IEnumerable<CauseNc> GetAll();
        CauseNc? GetById(int id);
        IEnumerable<CauseNc> GetByNc(int id_nc);
        void Add(CauseNc entity);
        void Update(CauseNc entity);
        void Delete(int id);

        void UpdateByNc(int id_nc, List<CauseNc> entities);
    }
}
