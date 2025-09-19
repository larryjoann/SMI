using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CopiloteRepository
    {
        private readonly ApplicationDbContext _context;

        public CopiloteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Copilote> GetAll()
            => _context.Set<Copilote>()
                .Include(c => c.Collaborateur)
                .Include(c => c.Processus)
                .ToList();

        public Copilote? GetById(int id)
        {
            return _context.Set<Copilote>()
                .Include(c => c.Collaborateur)
                .Include(c => c.Processus)
                .FirstOrDefault(c => c.Id == id);
        }

        public void Add(Copilote copilote)
        {
            _context.Set<Copilote>().Add(copilote);
            _context.SaveChanges();
        }

        public void AddRange(List<Copilote> copilotes)
        {
            _context.Set<Copilote>().AddRange(copilotes);
            _context.SaveChanges();
        }

        public void Update(Copilote copilote)
        {
            _context.Set<Copilote>().Update(copilote);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Copilote>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Copilote>().RemoveRange(_context.Set<Copilote>());
            _context.SaveChanges();
        }

        public List<Copilote> GetByProcessus(int idProcessus)
            => _context.Set<Copilote>()
                .Include(c => c.Collaborateur)
                .Include(c => c.Processus)
                .Where(c => c.IdProcessus == idProcessus)
                .ToList();

        public void DeleteByProcessus(int idProcessus)
        {
            var copilotes = _context.Set<Copilote>().Where(c => c.IdProcessus == idProcessus).ToList();
            if (copilotes.Any())
            {
                _context.Set<Copilote>().RemoveRange(copilotes);
                _context.SaveChanges();
            }
        }
    }
}