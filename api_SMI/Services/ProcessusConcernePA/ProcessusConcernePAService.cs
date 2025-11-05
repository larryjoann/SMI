using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class ProcessusConcernePAService : IProcessusConcernePAService
    {
        private readonly ProcessusConcernePARepository _repo;

        public ProcessusConcernePAService(ProcessusConcernePARepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<ProcessusConcernePA> GetAll() => _repo.GetAll();

        public ProcessusConcernePA? GetById(int id) => _repo.GetById(id);

        public void Add(ProcessusConcernePA pc) => _repo.Add(pc);

        public void Update(ProcessusConcernePA pc) => _repo.Update(pc);

        public void Delete(int id) => _repo.Delete(id);
    }
}
