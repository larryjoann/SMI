using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ObjectifStrategiqueRepository
    {
        private readonly ApplicationDbContext _context;

        public ObjectifStrategiqueRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ObjectifStrategique> GetAll()
            => _context.Set<ObjectifStrategique>()
                .ToList();

        public ObjectifStrategique? GetById(int id)
            => _context.Set<ObjectifStrategique>()
                .FirstOrDefault(o => o.Id == id);

        public void Add(ObjectifStrategique entity)
        {
            _context.Set<ObjectifStrategique>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(ObjectifStrategique entity)
        {
            _context.Set<ObjectifStrategique>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ObjectifStrategique>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}