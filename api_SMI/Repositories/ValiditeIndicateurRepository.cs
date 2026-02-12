using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ValiditeIndicateurRepository
    {
        private readonly ApplicationDbContext _context;

        public ValiditeIndicateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ValiditeIndicateur> GetAll()
            => _context.Set<ValiditeIndicateur>()
                .Include(v => v.Indicateur)
                .ToList();

        public ValiditeIndicateur? GetById(int id)
            => _context.Set<ValiditeIndicateur>()
                .Include(v => v.Indicateur)
                .FirstOrDefault(v => v.Id == id);

        public void Add(ValiditeIndicateur entity)
        {
            _context.Set<ValiditeIndicateur>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(ValiditeIndicateur entity)
        {
            _context.Set<ValiditeIndicateur>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ValiditeIndicateur>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}