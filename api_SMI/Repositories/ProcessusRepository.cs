using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ProcessusRepository
    {
        private readonly ApplicationDbContext _context;

        public ProcessusRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Processus> GetAll()
            => _context.Set<Processus>()
                .Include(p => p.CategorieProcessus)
                .Include(p => p.ResponsablesProcessus)
                    .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.ResponsablesProcessus)
                    .ThenInclude(rp => rp.TypeResponsableProcessus)
                    .ThenInclude(t => t.Role)
                .Include(p => p.Validites)
                .Include(p => p.Intercations)
                    //.ThenInclude(i => i.ProcessusInteragi)
                .Include(p => p.RessourcesProcessus)
                    .ThenInclude(r => r.CategorieRessources)
                .Include(p => p.PartieInteresseAttentes)
                .Include(p => p.Activites)
                .Where(p => p.Status == true)
                .ToList();

        public Processus? GetById(int id)
        {
            return _context.Set<Processus>()
                .Include(p => p.CategorieProcessus)
                .Include(p => p.ResponsablesProcessus)
                    .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.ResponsablesProcessus)
                    .ThenInclude(rp => rp.TypeResponsableProcessus)
                    .ThenInclude(t => t.Role)
                .Include(p => p.Validites)
                .Include(p => p.Intercations)
                //.Include(p => p.IntercationsInteragi)
                .Include(p => p.RessourcesProcessus)
                    .ThenInclude(r => r.CategorieRessources)
                .Include(p => p.PartieInteresseAttentes)
                .Include(p => p.Activites)
                .Where(p => p.Status == true)
                .FirstOrDefault(p => p.Id == id);
        }

        public void Add(Processus processus)
        {
            _context.Set<Processus>().Add(processus);
            _context.SaveChanges();
        }

        public void AddRange(List<Processus> processusList)
        {
            _context.Set<Processus>().AddRange(processusList);
            _context.SaveChanges();
        }

        public void Update(Processus processus)
        {
            _context.Set<Processus>().Update(processus);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Processus>().Remove(entity);
                _context.SaveChanges();
            }
        }


        public void DeleteAll()
        {
            _context.Set<Processus>().RemoveRange(_context.Set<Processus>());
            _context.SaveChanges();
        }
    }
}