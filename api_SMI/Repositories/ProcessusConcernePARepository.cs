using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ProcessusConcernePARepository
    {
        private readonly ApplicationDbContext _context;

        public ProcessusConcernePARepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ProcessusConcernePA> GetAll()
            => _context.Set<ProcessusConcernePA>()
                //.Include(pc => pc.PlanAction)
                    //.ThenInclude(pa => pa.SourcePA)
                .Include(pc => pc.Processus)
                .ToList();
        public ProcessusConcernePA? GetById(int id)
        {
            return _context.Set<ProcessusConcernePA>()
                //.Include(pc => pc.PlanAction)
                    //.ThenInclude(pa => pa.SourcePA)
                .Include(pc => pc.Processus)
                .FirstOrDefault(pc => pc.Id == id);
        }

        public void Add(ProcessusConcernePA pc)
        {
            _context.Set<ProcessusConcernePA>().Add(pc);
            _context.SaveChanges();
        }

        public void AddRange(List<ProcessusConcernePA> pcs)
        {
            _context.Set<ProcessusConcernePA>().AddRange(pcs);
            _context.SaveChanges();
        }

        public void Update(ProcessusConcernePA pc)
        {
            _context.Set<ProcessusConcernePA>().Update(pc);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ProcessusConcernePA>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<ProcessusConcernePA>().RemoveRange(_context.Set<ProcessusConcernePA>());
            _context.SaveChanges();
        }
    }
}
