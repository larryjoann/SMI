using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IUniteMesureService
    {
        List<UniteMesure> GetAll();
        UniteMesure? GetById(int id);
        void Add(UniteMesure u);
        void Update(UniteMesure u);
        void Delete(int id);
    }
}