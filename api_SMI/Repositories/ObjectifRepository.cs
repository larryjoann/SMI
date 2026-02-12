using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ObjectifRepository
    {
        private readonly ApplicationDbContext _context;

        public ObjectifRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Objectif> GetAll()
            => _context.Set<Objectif>()
                .Include(o => o.Processus)
                .Include(o => o.ObjectifStrategique)
                .Include(o => o.Indicateurs)
                .ToList();

        public Objectif? GetById(int id)
            => _context.Set<Objectif>()
                .Include(o => o.Processus)
                .Include(o => o.ObjectifStrategique)
                .Include(o => o.Indicateurs)
                .FirstOrDefault(o => o.Id == id);

        public void Add(Objectif entity)
        {
            _context.Set<Objectif>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(Objectif entity)
        {
            _context.Set<Objectif>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Objectif>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}