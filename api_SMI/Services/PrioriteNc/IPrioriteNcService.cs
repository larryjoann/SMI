using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IPrioriteNcService
    {
        List<PrioriteNc> GetAll();
        PrioriteNc? GetById(int id);
        void Add(PrioriteNc entity);
        void Update(PrioriteNc entity);
        void Delete(int id);
    }
}