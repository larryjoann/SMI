using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class StatusPAService : IStatusPAService
    {
        private readonly StatusPARepository _repo;

        public StatusPAService(StatusPARepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<StatusPA> GetAll() => _repo.GetAll();

        public StatusPA? GetById(int id) => _repo.GetById(id);

        public void Add(StatusPA status) => _repo.Add(status);

        public void Update(StatusPA status) => _repo.Update(status);

        public void Delete(int id) => _repo.Delete(id);
    }
}
