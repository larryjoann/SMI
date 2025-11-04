using api_SMI.Data;
using Microsoft.EntityFrameworkCore;
using StatusActionModel = api_SMI.Models.StatusAction;

namespace api_SMI.Repositories
{
    public class StatusActionRepository
    {
        private readonly ApplicationDbContext _context;

        public StatusActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<StatusActionModel> GetAll()
            => _context.Set<StatusActionModel>().ToList();

        public StatusActionModel? GetById(int id)
            => _context.Set<StatusActionModel>().Find(id);

        public void Add(StatusActionModel status)
        {
            _context.Set<StatusActionModel>().Add(status);
            _context.SaveChanges();
        }

        public void Update(StatusActionModel status)
        {
            _context.Set<StatusActionModel>().Update(status);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<StatusActionModel>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<StatusActionModel>().RemoveRange(_context.Set<StatusActionModel>());
            _context.SaveChanges();
        }
    }
}
