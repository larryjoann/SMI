using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class MesureIndicateurRepository
    {
        private readonly ApplicationDbContext _context;

        public MesureIndicateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<MesureIndicateur> GetAll()
            => _context.Set<MesureIndicateur>()
                .Include(m => m.CibleIndicateur)
                .ToList();

        public MesureIndicateur? GetById(int id)
            => _context.Set<MesureIndicateur>()
                .Include(m => m.CibleIndicateur)
                .FirstOrDefault(m => m.Id == id);

        public void Add(MesureIndicateur entity)
        {
            _context.Set<MesureIndicateur>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(MesureIndicateur entity)
        {
            _context.Set<MesureIndicateur>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<MesureIndicateur>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}