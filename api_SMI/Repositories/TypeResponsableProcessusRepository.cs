using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class TypeResponsableProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public TypeResponsableProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<TypeResponsableProcessus> GetAll()
            => _context.Set<TypeResponsableProcessus>()
                .Include(t => t.Role)
                .Include(t => t.ResponsablesProcessus)
                .ToList();

        public TypeResponsableProcessus? GetById(int id)
        {
            return _context.Set<TypeResponsableProcessus>()
                .Include(t => t.Role)
                .Include(t => t.ResponsablesProcessus)
                .FirstOrDefault(t => t.Id == id);
        }

        public List<TypeResponsableProcessus> GetByRole(int idRole)
            => _context.Set<TypeResponsableProcessus>()
                .Include(t => t.Role)
                .Include(t => t.ResponsablesProcessus)
                .Where(t => t.IdRole == idRole)
                .ToList();

        public void Add(TypeResponsableProcessus typeResponsableProcessus)
        {
            _context.Set<TypeResponsableProcessus>().Add(typeResponsableProcessus);
            _context.SaveChanges();
        }

        public void AddRange(List<TypeResponsableProcessus> typesResponsablesProcessus)
        {
            _context.Set<TypeResponsableProcessus>().AddRange(typesResponsablesProcessus);
            _context.SaveChanges();
        }

        public void Update(TypeResponsableProcessus typeResponsableProcessus)
        {
            _context.Set<TypeResponsableProcessus>().Update(typeResponsableProcessus);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<TypeResponsableProcessus>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<TypeResponsableProcessus>().RemoveRange(_context.Set<TypeResponsableProcessus>());
            _context.SaveChanges();
        }
    }
}
