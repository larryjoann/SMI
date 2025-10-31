using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace api_SMI.Repositories
{
    public class HistoriqueRepository
    {
        private readonly ApplicationDbContext _context;

        public HistoriqueRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Historique> GetAll()
            => _context.Set<Historique>()
                .Include(h => h.Collaborateur)
                .Include(h => h.Operation)
                .Include(h => h.Entite)
                .OrderByDescending(h => h.Datetime)
                .ToList();

        public Historique? GetById(int id)
        {
            return _context.Set<Historique>()
                .Include(h => h.Collaborateur)
                .Include(h => h.Operation)
                .Include(h => h.Entite)
                .FirstOrDefault(h => h.Id == id);
        }

        // Get historiques by entite id and object id
        public List<Historique> GetByEntiteAndIdObject(int idEntite, int idObject)
            => _context.Set<Historique>()
                .Include(h => h.Collaborateur)
                .Include(h => h.Operation)
                .Include(h => h.Entite)
                .Where(h => h.IdEntite == idEntite && h.IdObject == idObject)
                .OrderByDescending(h => h.Datetime)
                .ToList();

        public void Add(Historique historique)
        {
            _context.Set<Historique>().Add(historique);
            _context.SaveChanges();
        }

        public void AddRange(List<Historique> items)
        {
            _context.Set<Historique>().AddRange(items);
            _context.SaveChanges();
        }

        public void Update(Historique historique)
        {
            _context.Set<Historique>().Update(historique);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Historique>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Historique>().RemoveRange(_context.Set<Historique>());
            _context.SaveChanges();
        }
    }
}
