using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Repositories
{
    public class PhaseNcRepository
    {
        private readonly ApplicationDbContext _context;

        public PhaseNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PhaseNc> GetAll()
            => _context.Set<PhaseNc>().ToList();

        public PhaseNc? GetById(int id)
            => _context.Set<PhaseNc>().Find(id);

        public void Add(PhaseNc entity)
        {
            _context.Set<PhaseNc>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(PhaseNc entity)
        {
            _context.Set<PhaseNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<PhaseNc>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}
