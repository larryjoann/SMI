using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IObjectifStrategiqueService
    {
        List<ObjectifStrategique> GetAll();
        ObjectifStrategique? GetById(int id);
        void Add(ObjectifStrategique s);
        void Update(ObjectifStrategique s);
        void Delete(int id);
    }
}