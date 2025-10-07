using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class LieuRepository
    {
        private readonly ApplicationDbContext _context;

        public LieuRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Lieu> GetAll()
            => _context.Set<Lieu>().ToList();

        public Lieu? GetById(int id)
            => _context.Set<Lieu>().FirstOrDefault(l => l.Id == id);

        public void Add(Lieu lieu)
        {
            _context.Set<Lieu>().Add(lieu);
            _context.SaveChanges();
        }

        public void AddRange(List<Lieu> lieux)
        {
            _context.Set<Lieu>().AddRange(lieux);
            _context.SaveChanges();
        }

        public void Update(Lieu lieu)
        {
            _context.Set<Lieu>().Update(lieu);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Lieu>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<Lieu>().RemoveRange(_context.Set<Lieu>());
            _context.SaveChanges();
        }
    }
}