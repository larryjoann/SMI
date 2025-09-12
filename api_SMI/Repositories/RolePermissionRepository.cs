using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class RolePermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<RolePermission> GetAll()
            => _context.Set<RolePermission>().ToList();

        public RolePermission? GetById(int id)
        {
            return _context.Set<RolePermission>().FirstOrDefault(rp => rp.Id == id);
        }

        public void Add(RolePermission rolePermission)
        {
            _context.Set<RolePermission>().Add(rolePermission);
            _context.SaveChanges();
        }

        public void AddRange(List<RolePermission> rolePermissions)
        {
            _context.Set<RolePermission>().AddRange(rolePermissions);
            _context.SaveChanges();
        }

        public void Update(RolePermission rolePermission)
        {
            _context.Set<RolePermission>().Update(rolePermission);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<RolePermission>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<RolePermission>().RemoveRange(_context.Set<RolePermission>());
            _context.SaveChanges();
        }
    }
}