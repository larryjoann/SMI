using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Repositories
{
    public class PrioriteNcRepository
    {
        private readonly ApplicationDbContext _context;

        public PrioriteNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PrioriteNc> GetAll()
            => _context.Set<PrioriteNc>().ToList();

        public PrioriteNc? GetById(int id)
            => _context.Set<PrioriteNc>().Find(id);

        public void Add(PrioriteNc entity)
        {
            _context.Set<PrioriteNc>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(PrioriteNc entity)
        {
            _context.Set<PrioriteNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<PrioriteNc>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}