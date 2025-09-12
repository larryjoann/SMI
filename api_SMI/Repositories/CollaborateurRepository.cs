using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CollaborateurRepository
    {
        private readonly ApplicationDbContext _context;

        public CollaborateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Collaborateur> GetAll()
            => _context.Set<Collaborateur>().ToList();

        public Collaborateur? GetByMatricule(string matricule)
        {
            return _context.Set<Collaborateur>().FirstOrDefault(c => c.Matricule == matricule);
        }

        public void Add(Collaborateur collaborateur)
        {
            _context.Set<Collaborateur>().Add(collaborateur);
            _context.SaveChanges();
        }

        public void AddRange(List<Collaborateur> collaborateurs)
        {
            _context.Set<Collaborateur>().AddRange(collaborateurs);
            _context.SaveChanges();
        }

        public void Update(Collaborateur collaborateur)
        {
            _context.Set<Collaborateur>().Update(collaborateur);
            _context.SaveChanges();
        }

        public void Delete(string matricule)
        {
            var entity = GetByMatricule(matricule);
            if (entity != null)
            {
                _context.Set<Collaborateur>().Remove(entity);
                _context.SaveChanges();
            }
        }
        public void DeleteAll()
        {
            _context.Set<Collaborateur>().RemoveRange(_context.Set<Collaborateur>());
            _context.SaveChanges();
        }
    }
}
