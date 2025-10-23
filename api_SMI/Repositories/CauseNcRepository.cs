using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CauseNcRepository
    {
        private readonly ApplicationDbContext _context;

        public CauseNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CauseNc> GetAll()
            => _context.Set<CauseNc>()
                .Include(c => c.CategorieCauseNc)
                .Include(c => c.NonConformite)
                .ToList();

        public CauseNc? GetById(int id)
            => _context.Set<CauseNc>()
                .Include(c => c.CategorieCauseNc)
                .Include(c => c.NonConformite)
                .FirstOrDefault(c => c.Id == id);

        public List<CauseNc> GetByNc(int id_nc)
            => _context.Set<CauseNc>()
                .Where(c => c.IdNc == id_nc)
                .Include(c => c.CategorieCauseNc)
                .Include(c => c.NonConformite)
                .ToList();


        public void Add(CauseNc entity)
        {
            _context.Set<CauseNc>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<CauseNc> entities)
        {
            _context.Set<CauseNc>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(CauseNc entity)
        {
            _context.Set<CauseNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CauseNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteByNc(int id_nc)
        {
            _context.Set<CauseNc>()
                .RemoveRange(_context.Set<CauseNc>().Where(c => c.IdNc == id_nc));
        }

        public void DeleteAll()
        {
            _context.Set<CauseNc>().RemoveRange(_context.Set<CauseNc>());
            _context.SaveChanges();
        }
    }
}
