using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CategorieCauseNcRepository
    {
        private readonly ApplicationDbContext _context;

        public CategorieCauseNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CategorieCauseNc> GetAll()
            => _context.Set<CategorieCauseNc>().ToList();

        public CategorieCauseNc? GetById(int id)
            => _context.Set<CategorieCauseNc>().FirstOrDefault(c => c.Id == id);

        public void Add(CategorieCauseNc entity)
        {
            _context.Set<CategorieCauseNc>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<CategorieCauseNc> entities)
        {
            _context.Set<CategorieCauseNc>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(CategorieCauseNc entity)
        {
            _context.Set<CategorieCauseNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CategorieCauseNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<CategorieCauseNc>().RemoveRange(_context.Set<CategorieCauseNc>());
            _context.SaveChanges();
        }
    }
}
