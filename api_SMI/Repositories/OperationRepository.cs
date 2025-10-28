using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class OperationRepository
    {
        private readonly ApplicationDbContext _context;

        public OperationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Operation> GetAll()
            => _context.Set<Operation>()
                // .Include(o => o.Historiques)
                .ToList();

        public Operation? GetById(int id)
        {
            return _context.Set<Operation>()
                // .Include(o => o.Historiques)
                .FirstOrDefault(o => o.Id == id);
        }

        public void Add(Operation operation)
        {
            _context.Set<Operation>().Add(operation);
            _context.SaveChanges();
        }

        public void AddRange(List<Operation> operations)
        {
            _context.Set<Operation>().AddRange(operations);
            _context.SaveChanges();
        }

        public void Update(Operation operation)
        {
            _context.Set<Operation>().Update(operation);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Operation>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Operation>().RemoveRange(_context.Set<Operation>());
            _context.SaveChanges();
        }
    }
}
