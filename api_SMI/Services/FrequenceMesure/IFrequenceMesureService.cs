using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IFrequenceMesureService
    {
        List<FrequenceMesure> GetAll();
        FrequenceMesure? GetById(int id);
        void Add(FrequenceMesure f);
        void Update(FrequenceMesure f);
        void Delete(int id);
    }
}