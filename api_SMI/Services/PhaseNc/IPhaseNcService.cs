using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IPhaseNcService
    {
        List<PhaseNc> GetAll();
        PhaseNc? GetById(int id);
        void Add(PhaseNc entity);
        void Update(PhaseNc entity);
        void Delete(int id);
    }
}
