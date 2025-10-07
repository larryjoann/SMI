using api_SMI.Models;

namespace api_SMI.Services
{
    public interface ITypeNcService
    {
        List<TypeNc> GetAll();
        TypeNc? GetById(int id);
        void Add(TypeNc typeNc);
        void AddRange(List<TypeNc> typeNcs);
        void Update(TypeNc typeNc);
        void Delete(int id);
        void DeleteAll();
    }
}