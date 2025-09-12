using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CategorieProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public CategorieProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CategorieProcessus> GetAll()
            => _context.Set<CategorieProcessus>().ToList();

        public CategorieProcessus? GetById(int id)
        {
            return _context.Set<CategorieProcessus>().FirstOrDefault(c => c.Id == id);
        }

        public void Add(CategorieProcessus categorie)
        {
            _context.Set<CategorieProcessus>().Add(categorie);
            _context.SaveChanges();
        }

        public void AddRange(List<CategorieProcessus> categories)
        {
            _context.Set<CategorieProcessus>().AddRange(categories);
            _context.SaveChanges();
        }

        public void Update(CategorieProcessus categorie)
        {
            _context.Set<CategorieProcessus>().Update(categorie);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CategorieProcessus>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<CategorieProcessus>().RemoveRange(_context.Set<CategorieProcessus>());
            _context.SaveChanges();
        }
    }
}