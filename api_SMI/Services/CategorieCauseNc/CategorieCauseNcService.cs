using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CategorieCauseNcService : ICategorieCauseNcService
    {
        private readonly CategorieCauseNcRepository _repository;

        public CategorieCauseNcService(CategorieCauseNcRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<CategorieCauseNc> GetAll() => _repository.GetAll();

        public CategorieCauseNc? GetById(int id) => _repository.GetById(id);

        public void Add(CategorieCauseNc entity) => _repository.Add(entity);

        public void Update(CategorieCauseNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);
    }
}
