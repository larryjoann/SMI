using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class UniteMesureService : IUniteMesureService
    {
        private readonly UniteMesureRepository _repository;

        public UniteMesureService(UniteMesureRepository repository)
        {
            _repository = repository;
        }

        public List<UniteMesure> GetAll() => _repository.GetAll();

        public UniteMesure? GetById(int id) => _repository.GetById(id);

        public void Add(UniteMesure u) => _repository.Add(u);

        public void Update(UniteMesure u) => _repository.Update(u);

        public void Delete(int id) => _repository.Delete(id);
    }
}