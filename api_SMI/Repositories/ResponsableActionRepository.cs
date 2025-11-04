using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ResponsableActionRepository
    {
        private readonly ApplicationDbContext _context;

        public ResponsableActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponsableAction> GetAll()
            => _context.Set<ResponsableAction>()
                .Include(r => r.Action)
                .Include(r => r.Assignateur)
                .Include(r => r.Responsable)
                .ToList();

        public ResponsableAction? GetById(int id)
        {
            return _context.Set<ResponsableAction>()
                .Include(r => r.Action)
                .Include(r => r.Assignateur)
                .Include(r => r.Responsable)
                .FirstOrDefault(r => r.Id == id);
        }

        public void Add(ResponsableAction resp)
        {
            _context.Set<ResponsableAction>().Add(resp);
            _context.SaveChanges();
        }

        public void AddRange(List<ResponsableAction> list)
        {
            _context.Set<ResponsableAction>().AddRange(list);
            _context.SaveChanges();
        }

        public void Update(ResponsableAction resp)
        {
            _context.Set<ResponsableAction>().Update(resp);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ResponsableAction>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<ResponsableAction>().RemoveRange(_context.Set<ResponsableAction>());
            _context.SaveChanges();
        }
    }
}
