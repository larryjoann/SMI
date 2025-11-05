using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class PlanActionRepository
    {
        private readonly ApplicationDbContext _context;

        public PlanActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PlanAction> GetAll()
            => _context.Set<PlanAction>()
                .Include(pa => pa.SourcePA)
                .Include(pa => pa.StatusPA)
                .Include(pa => pa.ProcessusConcernes)
                    .ThenInclude(pc => pc.Processus)
                .Where(pa => pa.Status == true)
                .ToList();

        public PlanAction? GetById(int id)
        {
            return _context.Set<PlanAction>()
                .Include(pa => pa.SourcePA)
                .Include(pa => pa.StatusPA)
                .Include(pa => pa.ProcessusConcernes)
                    .ThenInclude(pc => pc.Processus)
                .Where(pa => pa.Status == true)
                .FirstOrDefault(pa => pa.Id == id);
        }

        public void Add(PlanAction planAction)
        {
            _context.Set<PlanAction>().Add(planAction);
            _context.SaveChanges();
        }

        public void AddRange(List<PlanAction> planActions)
        {
            _context.Set<PlanAction>().AddRange(planActions);
            _context.SaveChanges();
        }

        public void Update(PlanAction planAction)
        {
            _context.Set<PlanAction>().Update(planAction);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<PlanAction>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<PlanAction>().RemoveRange(_context.Set<PlanAction>());
            _context.SaveChanges();
        }
    }
}
