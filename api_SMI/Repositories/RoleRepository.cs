using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class RoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Role> GetAll()
            => _context.Set<Role>().ToList();

        public Role? GetById(int id)
        {
            return _context.Set<Role>().FirstOrDefault(r => r.Id == id);
        }

        public void Add(Role role)
        {
            _context.Set<Role>().Add(role);
            _context.SaveChanges();
        }

        public void AddRange(List<Role> roles)
        {
            _context.Set<Role>().AddRange(roles);
            _context.SaveChanges();
        }

        public void Update(Role role)
        {
            _context.Set<Role>().Update(role);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Role>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Role>().RemoveRange(_context.Set<Role>());
            _context.SaveChanges();
        }
    }
}