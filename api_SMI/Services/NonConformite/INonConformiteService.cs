using api_SMI.Models;

namespace api_SMI.Services
{
    public interface INonConformiteService
    {
        List<NonConformite> GetAll();
        NonConformite? GetById(int id);
        void Declare(NonConformite nonConformite);
        void Draft(NonConformite nonConformite);
        void DraftToDeclare(NonConformite nonConformite);
        void AddRange(List<NonConformite> nonConformiteList);
        void Update(NonConformite nonConformite);
        void Delete(int id);
        void DeleteAll();
        List<NonConformite> GetDrafts();
        List<NonConformite> GetDeclare();
    void Archiver(int id);
    }
}