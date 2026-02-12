using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class FrequenceMesureRepository
    {
        private readonly ApplicationDbContext _context;

        public FrequenceMesureRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<FrequenceMesure> GetAll()
            => _context.Set<FrequenceMesure>()
                .Include(f => f.Indicateurs)
                .ToList();

        public FrequenceMesure? GetById(int id)
            => _context.Set<FrequenceMesure>()
                .Include(f => f.Indicateurs)
                .FirstOrDefault(f => f.Id == id);

        public void Add(FrequenceMesure entity)
        {
            _context.Set<FrequenceMesure>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(FrequenceMesure entity)
        {
            _context.Set<FrequenceMesure>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<FrequenceMesure>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}