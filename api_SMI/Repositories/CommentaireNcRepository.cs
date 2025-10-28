using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CommentaireNcRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentaireNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CommentaireNc> GetAll()
            => _context.Set<CommentaireNc>()
            .Include(c => c.Collaborateur)
            .ToList();

        public CommentaireNc? GetById(int id)
            => _context.Set<CommentaireNc>()
            .Include(c => c.Collaborateur)
            .FirstOrDefault(c => c.Id == id);

        public List<CommentaireNc> GetByNc(int idNc)
            => _context.Set<CommentaireNc>()
            .Include(c => c.Collaborateur)
            .Where(c => c.IdNc == idNc).ToList();

        public void Add(CommentaireNc entity)
        {
            _context.Set<CommentaireNc>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<CommentaireNc> entities)
        {
            _context.Set<CommentaireNc>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(CommentaireNc entity)
        {
            _context.Set<CommentaireNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CommentaireNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteByNc(int idNc)
        {
            var list = _context.Set<CommentaireNc>().Where(c => c.IdNc == idNc).ToList();
            if (list.Any())
            {
                _context.Set<CommentaireNc>().RemoveRange(list);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<CommentaireNc>().RemoveRange(_context.Set<CommentaireNc>());
            _context.SaveChanges();
        }
    }
}
