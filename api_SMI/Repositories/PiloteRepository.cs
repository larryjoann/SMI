using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class PiloteRepository
    {
        private readonly ApplicationDbContext _context;

        public PiloteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Pilote> GetAll()
            => _context.Set<Pilote>()
                .Include(p => p.Collaborateur)
                .Include(p => p.Processus)
                .ToList();

        public Pilote? GetById(int id)
        {
            return _context.Set<Pilote>()
                .Include(p => p.Collaborateur)
                .Include(p => p.Processus)
                .FirstOrDefault(p => p.Id == id);
        }

        public void Add(Pilote pilote)
        {
            _context.Set<Pilote>().Add(pilote);
            _context.SaveChanges();
        }

        public void AddRange(List<Pilote> pilotes)
        {
            _context.Set<Pilote>().AddRange(pilotes);
            _context.SaveChanges();
        }

        public void Update(Pilote pilote)
        {
            _context.Set<Pilote>().Update(pilote);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Pilote>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Pilote>().RemoveRange(_context.Set<Pilote>());
            _context.SaveChanges();
        }

        public List<Pilote> GetByProcessus(int idProcessus)
            => _context.Set<Pilote>()
                .Include(p => p.Collaborateur)
                .Include(p => p.Processus)
                .Where(p => p.IdProcessus == idProcessus)
                .ToList();

        public void DeleteByProcessus(int idProcessus)
        {
            var pilotes = _context.Set<Pilote>().Where(p => p.IdProcessus == idProcessus).ToList();
            if (pilotes.Any())
            {
                _context.Set<Pilote>().RemoveRange(pilotes);
                _context.SaveChanges();
            }
        }
    }
}