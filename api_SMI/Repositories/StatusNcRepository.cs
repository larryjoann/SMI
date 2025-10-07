using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Repositories
{
    public class StatusNcRepository
    {
        private readonly ApplicationDbContext _context;

        public StatusNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<StatusNc> GetAll()
            => _context.Set<StatusNc>().ToList();

        public StatusNc? GetById(int id)
            => _context.Set<StatusNc>().Find(id);

        public void Add(StatusNc entity)
        {
            _context.Set<StatusNc>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(StatusNc entity)
        {
            _context.Set<StatusNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<StatusNc>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}