using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class PermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public PermissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Permission> GetAll()
            => _context.Set<Permission>().ToList();

        public Permission? GetById(int id)
        {
            return _context.Set<Permission>().FirstOrDefault(p => p.Id == id);
        }

        public void Add(Permission permission)
        {
            _context.Set<Permission>().Add(permission);
            _context.SaveChanges();
        }

        public void AddRange(List<Permission> permissions)
        {
            _context.Set<Permission>().AddRange(permissions);
            _context.SaveChanges();
        }

        public void Update(Permission permission)
        {
            _context.Set<Permission>().Update(permission);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Permission>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Permission>().RemoveRange(_context.Set<Permission>());
            _context.SaveChanges();
        }
    }
}