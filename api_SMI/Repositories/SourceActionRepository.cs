using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class SourceActionRepository
    {
        private readonly ApplicationDbContext _context;

        public SourceActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SourceAction> GetAll()
            => _context.Set<SourceAction>()
                .Include(s => s.Action)
                .Include(s => s.Entite)
                .ToList();

        public SourceAction? GetById(int id)
        {
            return _context.Set<SourceAction>()
                .Include(s => s.Action)
                .Include(s => s.Entite)
                .FirstOrDefault(s => s.Id == id);
        }

        public void Add(SourceAction source)
        {
            _context.Set<SourceAction>().Add(source);
            _context.SaveChanges();
        }

        public void AddRange(List<SourceAction> sources)
        {
            _context.Set<SourceAction>().AddRange(sources);
            _context.SaveChanges();
        }

        public void Update(SourceAction source)
        {
            _context.Set<SourceAction>().Update(source);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<SourceAction>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<SourceAction>().RemoveRange(_context.Set<SourceAction>());
            _context.SaveChanges();
        }
    }
}
