using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class NonConformiteRepository
    {
        private readonly ApplicationDbContext _context;

        public NonConformiteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public void Archiver(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                entity.Status = false;
                _context.Set<NonConformite>().Update(entity);
                _context.SaveChanges();
            }
        }

        public void Restorer(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                entity.Status = true;
                _context.Set<NonConformite>().Update(entity);
                _context.SaveChanges();
            }
        }

        public List<NonConformite> GetAll()
            => _context.Set<NonConformite>()
                .Include(nc => nc.Lieu)
                .Include(nc => nc.TypeNc)
                .Include(nc => nc.StatusNc)
                .Include(nc => nc.PrioriteNc)
                .Include(nc => nc.Emetteur)
                .Where(nc => nc.Status == true)
                .Where(nc => nc.DateTimeDeclare != null)
                .OrderByDescending(nc => nc.DateTimeCreation)
                .ToList();

        public NonConformite? GetById(int id)
        {
            return _context.Set<NonConformite>()
                .Include(nc => nc.Lieu)
                .Include(nc => nc.TypeNc)
                .Include(nc => nc.StatusNc)
                .Include(nc => nc.PrioriteNc)
                .Include(nc => nc.Emetteur)
                .FirstOrDefault(nc => nc.Id == id);
        }

        public void Add(NonConformite nonConformite)
        {
            _context.Set<NonConformite>().Add(nonConformite);
            _context.SaveChanges();
        }

        public void AddRange(List<NonConformite> nonConformiteList)
        {
            _context.Set<NonConformite>().AddRange(nonConformiteList);
            _context.SaveChanges();
        }

        public void Update(NonConformite nonConformite)
        {
            _context.Set<NonConformite>().Update(nonConformite);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<NonConformite>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<NonConformite>().RemoveRange(_context.Set<NonConformite>());
            _context.SaveChanges();
        }

        public List<NonConformite> GetDrafts(string matriculeEmetteur)
        {
            return _context.Set<NonConformite>()
                .Include(nc => nc.Lieu)
                .Include(nc => nc.TypeNc)
                .Include(nc => nc.StatusNc)
                .Include(nc => nc.PrioriteNc)
                .Where(nc => nc.MatriculeEmetteur == matriculeEmetteur)
                .Where(nc => nc.DateTimeDeclare == null)
                .Where(nc => nc.Status == true)
                .OrderByDescending(nc => nc.DateTimeCreation)
                .ToList();
        }

        public List<NonConformite> GetDeclare(string matriculeEmetteur)
        {
            return _context.Set<NonConformite>()
                .Include(nc => nc.Lieu)
                .Include(nc => nc.TypeNc)
                .Include(nc => nc.StatusNc)
                .Include(nc => nc.PrioriteNc)
                .Where(nc => nc.MatriculeEmetteur == matriculeEmetteur)
                .Where(nc => nc.DateTimeDeclare != null)
                .Where(nc => nc.Status == true)
                .OrderByDescending(nc => nc.DateTimeDeclare)
                .ToList();
        }

        public List<NonConformite> GetArchived(string matriculeEmetteur)
        {
            return _context.Set<NonConformite>()
                .Include(nc => nc.Lieu)
                .Include(nc => nc.TypeNc)
                .Include(nc => nc.StatusNc)
                .Include(nc => nc.PrioriteNc)
                .Where(nc => nc.MatriculeEmetteur == matriculeEmetteur)
                .Where(nc => nc.Status == false)
                .OrderByDescending(nc => nc.DateTimeCreation)
                .ToList();
        }   
    }
}