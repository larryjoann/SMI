using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class FrequenceMesureService : IFrequenceMesureService
    {
        private readonly FrequenceMesureRepository _repository;

        public FrequenceMesureService(FrequenceMesureRepository repository)
        {
            _repository = repository;
        }

        public List<FrequenceMesure> GetAll() => _repository.GetAll();

        public FrequenceMesure? GetById(int id) => _repository.GetById(id);

        public void Add(FrequenceMesure f) => _repository.Add(f);

        public void Update(FrequenceMesure f) => _repository.Update(f);

        public void Delete(int id) => _repository.Delete(id);
    }
}