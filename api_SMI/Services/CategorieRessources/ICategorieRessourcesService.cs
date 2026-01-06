using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface ICategorieRessourcesService
    {
        IEnumerable<CategorieRessources> GetAll();
        CategorieRessources? GetById(int id);
        void Add(CategorieRessources entity);
        void Update(CategorieRessources entity);
        void Delete(int id);
    }
}