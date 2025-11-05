using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Repositories
{
    public class StatusPARepository
    {
        private readonly ApplicationDbContext _context;

        public StatusPARepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<StatusPA> GetAll()
            => _context.Set<StatusPA>().ToList();

        public StatusPA? GetById(int id)
            => _context.Set<StatusPA>().FirstOrDefault(s => s.Id == id);

        public void Add(StatusPA status)
        {
            _context.Set<StatusPA>().Add(status);
            _context.SaveChanges();
        }

        public void AddRange(List<StatusPA> statuses)
        {
            _context.Set<StatusPA>().AddRange(statuses);
            _context.SaveChanges();
        }

        public void Update(StatusPA status)
        {
            _context.Set<StatusPA>().Update(status);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<StatusPA>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<StatusPA>().RemoveRange(_context.Set<StatusPA>());
            _context.SaveChanges();
        }
    }
}
