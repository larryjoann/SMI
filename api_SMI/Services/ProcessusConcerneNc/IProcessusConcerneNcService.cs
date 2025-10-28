using api_SMI.Models;

namespace api_SMI.Services
{
    public interface IProcessusConcerneNcService
    {
        List<ProcessusConcerneNc> GetAll();
        ProcessusConcerneNc? GetById(int id);
        List<ProcessusConcerneNc> GetByNonConformite(int idNc);
        void Add(ProcessusConcerneNc entity);
        void AddRange(List<ProcessusConcerneNc> entities);
        void Update(ProcessusConcerneNc entity);
        void Delete(int id);
        void DeleteAll();

        void DeleteByNonConformite(int idNc);
        List<ProcessusConcerneNc> GetByMatricule(string matricule);
    }
}