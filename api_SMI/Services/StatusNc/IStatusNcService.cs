using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface IStatusNcService
    {
        List<StatusNc> GetAll();
        StatusNc? GetById(int id);
        void Add(StatusNc entity);
        void Update(StatusNc entity);
        void Delete(int id);
    }
}