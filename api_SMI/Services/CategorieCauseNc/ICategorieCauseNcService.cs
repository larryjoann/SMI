using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ICategorieCauseNcService
    {
        IEnumerable<CategorieCauseNc> GetAll();
        CategorieCauseNc? GetById(int id);
        void Add(CategorieCauseNc entity);
        void Update(CategorieCauseNc entity);
        void Delete(int id);
    }
}
