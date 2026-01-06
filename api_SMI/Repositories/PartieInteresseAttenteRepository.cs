using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class PartieInteresseAttenteRepository
    {
        private readonly ApplicationDbContext _context;

        public PartieInteresseAttenteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PartieInteresseAttente> GetAll()
            => _context.Set<PartieInteresseAttente>()
                .Include(p => p.Processus)
                .ToList();

        public PartieInteresseAttente? GetById(int id)
            => _context.Set<PartieInteresseAttente>()
                .Include(p => p.Processus)
                .FirstOrDefault(p => p.Id == id);

        public List<PartieInteresseAttente> GetByProcessus(int id_processus)
            => _context.Set<PartieInteresseAttente>().Where(p => p.IdProcessus == id_processus).ToList();

        public void Add(PartieInteresseAttente entity)
        {
            _context.Set<PartieInteresseAttente>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(PartieInteresseAttente entity)
        {
            _context.Set<PartieInteresseAttente>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var e = GetById(id);
            if (e != null)
            {
                _context.Set<PartieInteresseAttente>().Remove(e);
                _context.SaveChanges();
            }
        }

        public void DeleteByProcessus(int id_processus)
        {
            _context.Set<PartieInteresseAttente>().RemoveRange(_context.Set<PartieInteresseAttente>().Where(p => p.IdProcessus == id_processus));
            _context.SaveChanges();
        }
    }
}