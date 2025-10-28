using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class EntiteRepository
    {
        private readonly ApplicationDbContext _context;

        public EntiteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Entite> GetAll()
            => _context.Set<Entite>()
                // .Include(e => e.Historiques)
                .ToList();

        public Entite? GetById(int id)
        {
            return _context.Set<Entite>()
                // .Include(e => e.Historiques)
                .FirstOrDefault(e => e.Id == id);
        }

        public void Add(Entite entite)
        {
            _context.Set<Entite>().Add(entite);
            _context.SaveChanges();
        }

        public void AddRange(List<Entite> entites)
        {
            _context.Set<Entite>().AddRange(entites);
            _context.SaveChanges();
        }

        public void Update(Entite entite)
        {
            _context.Set<Entite>().Update(entite);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Entite>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Entite>().RemoveRange(_context.Set<Entite>());
            _context.SaveChanges();
        }
    }
}
