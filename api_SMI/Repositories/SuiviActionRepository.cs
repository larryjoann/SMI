using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class SuiviActionRepository
    {
        private readonly ApplicationDbContext _context;

        public SuiviActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SuiviAction> GetAll()
            => _context.Set<SuiviAction>()
                //.Include(s => s.Action)
                .ToList();

        public SuiviAction? GetById(int id)
        {
            return _context.Set<SuiviAction>()
                //.Include(s => s.Action)
                .FirstOrDefault(s => s.Id == id);
        }

        public void Add(SuiviAction suivi)
        {
            _context.Set<SuiviAction>().Add(suivi);
            _context.SaveChanges();
        }

        public void AddRange(List<SuiviAction> suivis)
        {
            _context.Set<SuiviAction>().AddRange(suivis);
            _context.SaveChanges();
        }

        public void Update(SuiviAction suivi)
        {
            _context.Set<SuiviAction>().Update(suivi);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<SuiviAction>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<SuiviAction>().RemoveRange(_context.Set<SuiviAction>());
            _context.SaveChanges();
        }
    }
}
