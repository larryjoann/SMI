using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class IndicateurRepository
    {
        private readonly ApplicationDbContext _context;

        public IndicateurRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Indicateur> GetAll()
            => _context.Set<Indicateur>()
                .Include(i => i.Objectif)
                    .ThenInclude(o => o.ObjectifStrategique)
                .Include(i => i.UniteMesure)
                .Include(i => i.FrequenceMesure)
                .Include(i => i.Cibles)
                .Include(i => i.Mesures)
                    .ThenInclude(m => m.CibleIndicateur)
                .Include(i => i.Validites)
                .ToList();

        public Indicateur? GetById(int id)
            => _context.Set<Indicateur>()
                .Include(i => i.Objectif)
                    .ThenInclude(o => o.ObjectifStrategique)
                .Include(i => i.UniteMesure)
                .Include(i => i.FrequenceMesure)
                .Include(i => i.Cibles)
                .Include(i => i.Mesures)
                    .ThenInclude(m => m.CibleIndicateur)
                .Include(i => i.Validites)
                .FirstOrDefault(i => i.Id == id);

        public void Add(Indicateur entity)
        {
            _context.Set<Indicateur>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(Indicateur entity)
        {
            _context.Set<Indicateur>().Update(entity);
            _context.SaveChanges();
        }
        
        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Indicateur>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}