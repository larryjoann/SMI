using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class SourcePARepository
    {
        private readonly ApplicationDbContext _context;

        public SourcePARepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<SourcePA> GetAll()
            => _context.Set<SourcePA>()
                //.Include(s => s.PlanActions)
                    //.ThenInclude(pa => pa.ProcessusConcernes)
                        //.ThenInclude(pc => pc.Processus)
                .ToList();

        public SourcePA? GetById(int id)
        {
            return _context.Set<SourcePA>()
                //.Include(s => s.PlanActions)
                    //.ThenInclude(pa => pa.ProcessusConcernes)
                        //.ThenInclude(pc => pc.Processus)
                .FirstOrDefault(s => s.Id == id);
        }

        public void Add(SourcePA source)
        {
            _context.Set<SourcePA>().Add(source);
            _context.SaveChanges();
        }

        public void AddRange(List<SourcePA> sources)
        {
            _context.Set<SourcePA>().AddRange(sources);
            _context.SaveChanges();
        }

        public void Update(SourcePA source)
        {
            _context.Set<SourcePA>().Update(source);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<SourcePA>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<SourcePA>().RemoveRange(_context.Set<SourcePA>());
            _context.SaveChanges();
        }
    }
}
