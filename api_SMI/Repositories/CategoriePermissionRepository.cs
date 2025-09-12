using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CategoriePermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoriePermissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CategoriePermission> GetAll()
            => _context.Set<CategoriePermission>().ToList();

        public CategoriePermission? GetById(int id)
        {
            return _context.Set<CategoriePermission>().FirstOrDefault(c => c.Id == id);
        }

        public void Add(CategoriePermission categoriePermission)
        {
            _context.Set<CategoriePermission>().Add(categoriePermission);
            _context.SaveChanges();
        }

        public void AddRange(List<CategoriePermission> categoriePermissions)
        {
            _context.Set<CategoriePermission>().AddRange(categoriePermissions);
            _context.SaveChanges();
        }

        public void Update(CategoriePermission categoriePermission)
        {
            _context.Set<CategoriePermission>().Update(categoriePermission);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CategoriePermission>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<CategoriePermission>().RemoveRange(_context.Set<CategoriePermission>());
            _context.SaveChanges();
        }
    }
}