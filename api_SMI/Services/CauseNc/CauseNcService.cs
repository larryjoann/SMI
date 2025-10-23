using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CauseNcService : ICauseNcService
    {
        private readonly CauseNcRepository _repository;

        public CauseNcService(CauseNcRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<CauseNc> GetAll() => _repository.GetAll();

        public IEnumerable<CauseNc> GetByNc(int id_nc)
            => _repository.GetByNc(id_nc);

        public CauseNc? GetById(int id) => _repository.GetById(id);



        public void Add(CauseNc entity) => _repository.Add(entity);

        public void Update(CauseNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void UpdateByNc(int id_nc, List<CauseNc> entities) {
            _repository.DeleteByNc(id_nc);
            _repository.AddRange(entities);
        }
    }
}
