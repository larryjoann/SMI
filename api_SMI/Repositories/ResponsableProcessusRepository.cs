using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ResponsableProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public ResponsableProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ResponsableProcessus> GetAll()
            => _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .ToList();

        public ResponsableProcessus? GetById(int id)
        {
            return _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .FirstOrDefault(r => r.Id == id);
        }

        public List<ResponsableProcessus> GetByProcessus(int idProcessus)
            => _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .Where(r => r.IdProcessus == idProcessus)
                .ToList();

        public List<ResponsableProcessus> GetByCollaborateur(string matriculeCollaborateur)
            => _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .Where(r => r.MatriculeCollaborateur == matriculeCollaborateur)
                .ToList();

        public List<ResponsableProcessus> GetByType(int idTypeResponsableProcessus)
            => _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .Where(r => r.IdTypeResponsableProcessus == idTypeResponsableProcessus)
                .ToList();

        public List<ResponsableProcessus> GetByProcessusAndType(int idProcessus, int idTypeResponsableProcessus)
            => _context.Set<ResponsableProcessus>()
                .Include(r => r.Collaborateur)
                .Include(r => r.Processus)
                .Include(r => r.TypeResponsableProcessus)
                .ThenInclude(t => t.Role)
                .Where(r => r.IdProcessus == idProcessus && r.IdTypeResponsableProcessus == idTypeResponsableProcessus)
                .ToList();

        public void Add(ResponsableProcessus responsableProcessus)
        {
            _context.Set<ResponsableProcessus>().Add(responsableProcessus);
            _context.SaveChanges();
        }

        public void AddRange(List<ResponsableProcessus> responsablesProcessus)
        {
            _context.Set<ResponsableProcessus>().AddRange(responsablesProcessus);
            _context.SaveChanges();
        }

        public void Update(ResponsableProcessus responsableProcessus)
        {
            _context.Set<ResponsableProcessus>().Update(responsableProcessus);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ResponsableProcessus>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<ResponsableProcessus>().RemoveRange(_context.Set<ResponsableProcessus>());
            _context.SaveChanges();
        }

        public void DeleteByProcessus(int idProcessus)
        {
            var responsables = _context.Set<ResponsableProcessus>().Where(r => r.IdProcessus == idProcessus).ToList();
            if (responsables.Any())
            {
                _context.Set<ResponsableProcessus>().RemoveRange(responsables);
                _context.SaveChanges();
            }
        }
    }
}
