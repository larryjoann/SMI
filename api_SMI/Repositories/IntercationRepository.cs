using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class IntercationRepository
    {
        private readonly ApplicationDbContext _context;

        public IntercationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Intercation> GetAll()
            => _context.Set<Intercation>()
                .Include(i => i.Processus)
                .ToList();

        public Intercation? GetById(int id)
            => _context.Set<Intercation>()
                .Include(i => i.Processus)
                .FirstOrDefault(i => i.Id == id);

        public List<Intercation> GetByProcessus(int id_processus)
            => _context.Set<Intercation>()
                .Where(i => i.IdProcessus == id_processus || i.IdProcessusInteragi == id_processus)
                .ToList();

        public void Add(Intercation entity)
        {
            _context.Set<Intercation>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(Intercation entity)
        {
            _context.Set<Intercation>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Intercation>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteByProcessus(int id_processus)
        {
            _context.Set<Intercation>().RemoveRange(_context.Set<Intercation>().Where(i => i.IdProcessus == id_processus || i.IdProcessusInteragi == id_processus));
            _context.SaveChanges();
        }
    }
}