using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class CibleIndicateurRepository
    {
        private readonly ApplicationDbContext _context;

        public CibleIndicateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<CibleIndicateur> GetAll()
            => _context.Set<CibleIndicateur>()
                //.Include(c => c.Indicateur)
                
                .ToList();

        public CibleIndicateur? GetById(int id)
            => _context.Set<CibleIndicateur>()
                //.Include(c => c.Indicateur)
              
                .FirstOrDefault(c => c.Id == id);

        public void Add(CibleIndicateur entity)
        {
            _context.Set<CibleIndicateur>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(CibleIndicateur entity)
        {
            _context.Set<CibleIndicateur>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<CibleIndicateur>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}
