using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class RoleCollaborateurRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleCollaborateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<RoleCollaborateur> GetAll()
            => _context.Set<RoleCollaborateur>().ToList();

        public RoleCollaborateur? GetById(int id)
        {
            return _context.Set<RoleCollaborateur>().FirstOrDefault(r => r.Id == id);
        }

        public void Add(RoleCollaborateur roleCollaborateur)
        {
            _context.Set<RoleCollaborateur>().Add(roleCollaborateur);
            _context.SaveChanges();
        }

        public void AddRange(List<RoleCollaborateur> roleCollaborateurs)
        {
            _context.Set<RoleCollaborateur>().AddRange(roleCollaborateurs);
            _context.SaveChanges();
        }

        public void Update(RoleCollaborateur roleCollaborateur)
        {
            _context.Set<RoleCollaborateur>().Update(roleCollaborateur);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<RoleCollaborateur>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<RoleCollaborateur>().RemoveRange(_context.Set<RoleCollaborateur>());
            _context.SaveChanges();
        }
    }
}