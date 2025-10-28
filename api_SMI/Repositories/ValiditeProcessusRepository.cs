using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ValiditeProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public ValiditeProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ValiditeProcessus> GetAll()
            => _context.Set<ValiditeProcessus>()
                .Include(v => v.Processus)
                .ToList();

        public ValiditeProcessus? GetById(int id)
            => _context.Set<ValiditeProcessus>()
                .Include(v => v.Processus)
                .FirstOrDefault(v => v.Id == id);

        public List<ValiditeProcessus> GetByProcessus(int id_processus)
            => _context.Set<ValiditeProcessus>()
                .Where(v => v.IdProcessus == id_processus)
                //.Include(v => v.Processus)
                .ToList();

        public void Add(ValiditeProcessus entity)
        {
            _context.Set<ValiditeProcessus>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<ValiditeProcessus> entities)
        {
            _context.Set<ValiditeProcessus>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(ValiditeProcessus entity)
        {
            _context.Set<ValiditeProcessus>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ValiditeProcessus>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteByProcessus(int id_processus)
        {
            _context.Set<ValiditeProcessus>()
                .RemoveRange(_context.Set<ValiditeProcessus>().Where(v => v.IdProcessus == id_processus));
            _context.SaveChanges();
        }

        public void DeleteAll()
        {
            _context.Set<ValiditeProcessus>().RemoveRange(_context.Set<ValiditeProcessus>());
            _context.SaveChanges();
        }
    }
}
