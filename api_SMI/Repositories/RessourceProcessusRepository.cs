using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class RessourceProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public RessourceProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<RessourceProcessus> GetAll()
            => _context.Set<RessourceProcessus>()
                .Include(r => r.Processus)
                .Include(r => r.CategorieRessources)
                .ToList();

        public RessourceProcessus? GetById(int id)
            => _context.Set<RessourceProcessus>()
                .Include(r => r.Processus)
                .Include(r => r.CategorieRessources)
                .FirstOrDefault(r => r.Id == id);

        public List<RessourceProcessus> GetByProcessus(int id_processus)
            => _context.Set<RessourceProcessus>()
                .Include(r => r.Processus)
                .Include(r => r.CategorieRessources)
                .Where(r => r.IdProcessus == id_processus)
                .ToList();

        public void Add(RessourceProcessus entity)
        {
            _context.Set<RessourceProcessus>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(RessourceProcessus entity)
        {
            _context.Set<RessourceProcessus>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var e = GetById(id);
            if (e != null)
            {
                _context.Set<RessourceProcessus>().Remove(e);
                _context.SaveChanges();
            }
        }

        public void DeleteByProcessus(int id_processus)
        {
            _context.Set<RessourceProcessus>().RemoveRange(_context.Set<RessourceProcessus>().Where(r => r.IdProcessus == id_processus));
            _context.SaveChanges();
        }
    }
}