using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ProcessusConcerneNcService : IProcessusConcerneNcService
    {
        private readonly ProcessusConcerneNcRepository _repository;

        public ProcessusConcerneNcService(ProcessusConcerneNcRepository repository)
        {
            _repository = repository;
        }

        public List<ProcessusConcerneNc> GetAll() => _repository.GetAll();

        public ProcessusConcerneNc? GetById(int id) => _repository.GetById(id);

        public List<ProcessusConcerneNc> GetByNonConformite(int idNc) => _repository.GetByNonConformite(idNc);

        public void Add(ProcessusConcerneNc entity) => _repository.Add(entity);

        public void AddRange(List<ProcessusConcerneNc> entities) => _repository.AddRange(entities);

        public void Update(ProcessusConcerneNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();

        public void DeleteByNonConformite(int idNc) => _repository.DeleteByNonConformite(idNc);
    }
}