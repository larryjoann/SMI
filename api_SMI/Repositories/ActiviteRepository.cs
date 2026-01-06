using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ActiviteRepository
    {
        private readonly ApplicationDbContext _context;

        public ActiviteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Activite> GetAll()
            => _context.Set<Activite>()
                .Include(a => a.Processus)
                .ToList();

        public Activite? GetById(int id)
            => _context.Set<Activite>()
                .Include(a => a.Processus)
                .FirstOrDefault(a => a.Id == id);

        public List<Activite> GetByProcessus(int id_processus)
            => _context.Set<Activite>().Where(a => a.IdProcessus == id_processus).ToList();

        public void Add(Activite entity)
        {
            _context.Set<Activite>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(Activite entity)
        {
            _context.Set<Activite>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var e = GetById(id);
            if (e != null)
            {
                _context.Set<Activite>().Remove(e);
                _context.SaveChanges();
            }
        }

        public void DeleteByProcessus(int id_processus)
        {
            _context.Set<Activite>().RemoveRange(_context.Set<Activite>().Where(a => a.IdProcessus == id_processus));
            _context.SaveChanges();
        }
    }
}