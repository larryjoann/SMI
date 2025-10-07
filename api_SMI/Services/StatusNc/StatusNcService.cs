using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class StatusNcService : IStatusNcService
    {
        private readonly StatusNcRepository _repository;

        public StatusNcService(StatusNcRepository repository)
        {
            _repository = repository;
        }

        public List<StatusNc> GetAll() => _repository.GetAll();

        public StatusNc? GetById(int id) => _repository.GetById(id);

        public void Add(StatusNc entity) => _repository.Add(entity);

        public void Update(StatusNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);
    }
}