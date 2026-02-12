using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class UniteMesureRepository
    {
        private readonly ApplicationDbContext _context;

        public UniteMesureRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<UniteMesure> GetAll()
            => _context.Set<UniteMesure>()
                .Include(u => u.Indicateurs)
                .ToList();

        public UniteMesure? GetById(int id)
            => _context.Set<UniteMesure>()
                .Include(u => u.Indicateurs)
                .FirstOrDefault(u => u.Id == id);

        public void Add(UniteMesure entity)
        {
            _context.Set<UniteMesure>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(UniteMesure entity)
        {
            _context.Set<UniteMesure>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<UniteMesure>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}