using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Repositories
{
    public class CategorieRessourcesRepository
    {
        private readonly ApplicationDbContext _context;

        public CategorieRessourcesRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CategorieRessources> GetAll() => _context.Set<CategorieRessources>().ToList();

        public CategorieRessources? GetById(int id) => _context.Set<CategorieRessources>().FirstOrDefault(c => c.Id == id);

        public void Add(CategorieRessources entity)
        {
            _context.Set<CategorieRessources>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(CategorieRessources entity)
        {
            _context.Set<CategorieRessources>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CategorieRessources>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}