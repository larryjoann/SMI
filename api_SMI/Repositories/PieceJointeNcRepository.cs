using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class PieceJointeNcRepository
    {
        private readonly ApplicationDbContext _context;

        public PieceJointeNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<PieceJointeNc> GetAll()
            => _context.Set<PieceJointeNc>()
                // .Include(p => p.NonConformite)
                .ToList();

        public PieceJointeNc? GetById(int id)
        {
            return _context.Set<PieceJointeNc>()
                // .Include(p => p.NonConformite)
                .FirstOrDefault(p => p.Id == id);
        }

        public void Add(PieceJointeNc piece)
        {
            _context.Set<PieceJointeNc>().Add(piece);
            _context.SaveChanges();
        }

        public void AddRange(List<PieceJointeNc> pieces)
        {
            _context.Set<PieceJointeNc>().AddRange(pieces);
            _context.SaveChanges();
        }

        public void Update(PieceJointeNc piece)
        {
            _context.Set<PieceJointeNc>().Update(piece);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<PieceJointeNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<PieceJointeNc>().RemoveRange(_context.Set<PieceJointeNc>());
            _context.SaveChanges();
        }

        public List<PieceJointeNc> GetByNonConformite(int idNc)
        {
            return _context.Set<PieceJointeNc>()
                .Where(p => p.IdNc == idNc)
                // .Include(p => p.NonConformite)
                .ToList();
        }

        public void DeleteByNonConformite(int idNc)
        {
            var entities = _context.Set<PieceJointeNc>().Where(p => p.IdNc == idNc);
            _context.Set<PieceJointeNc>().RemoveRange(entities);
            _context.SaveChanges();
        }
    }
}