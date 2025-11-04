using api_SMI.Data;
using ActionModel = api_SMI.Models.Action;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace api_SMI.Repositories
{
    public class ActionRepository
    {
        private readonly ApplicationDbContext _context;

        public ActionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ActionModel> GetAll()
            => _context.Set<ActionModel>()
                .Include(a => a.StatusAction)
                .Include(a => a.Suivis)
                .Include(a => a.Sources)
                    .ThenInclude(s => s.Entite)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Assignateur)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Responsable)
                .Where(a => a.Status == true)
                .ToList();

        public ActionModel? GetById(int id)
        {
            return _context.Set<ActionModel>()
                .Include(a => a.StatusAction)
                .Include(a => a.Suivis)
                .Include(a => a.Sources)
                    .ThenInclude(s => s.Entite)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Assignateur)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Responsable)
                .FirstOrDefault(a => a.Id == id);
        }

        // Retourne toutes les actions liées à une entité (via SourceAction.IdEntite)
        public List<ActionModel> GetByEntite(int entiteId)
            => _context.Set<ActionModel>()
                .Include(a => a.StatusAction)
                .Include(a => a.Suivis)
                .Include(a => a.Sources)
                    .ThenInclude(s => s.Entite)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Assignateur)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Responsable)
                .Where(a => a.Status == true)
                .Where(a => a.Sources.Any(s => s.IdEntite.HasValue && s.IdEntite.Value == entiteId))
                .ToList();

        // Retourne toutes les actions liées à une entité et à un "objet" (via SourceAction.IdEntite et IdObjet)
        public List<ActionModel> GetByEntiteAndObject(int entiteId, int objetId)
            => _context.Set<ActionModel>()
                .Include(a => a.StatusAction)
                .Include(a => a.Suivis)
                .Include(a => a.Sources)
                    .ThenInclude(s => s.Entite)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Assignateur)
                .Include(a => a.Responsables)
                    .ThenInclude(r => r.Responsable)
                .Where(a => a.Status == true)
                .Where(a => a.Sources.Any(s => s.IdEntite.HasValue && s.IdEntite.Value == entiteId
                                              && s.IdObjet.HasValue && s.IdObjet.Value == objetId))
                .ToList();

        public void Add(ActionModel action)
        {
            _context.Set<ActionModel>().Add(action);
            _context.SaveChanges();
        }

        public void AddRange(List<ActionModel> actions)
        {
            _context.Set<ActionModel>().AddRange(actions);
            _context.SaveChanges();
        }

        public void Update(ActionModel action)
        {
            _context.Set<ActionModel>().Update(action);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ActionModel>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<ActionModel>().RemoveRange(_context.Set<ActionModel>());
            _context.SaveChanges();
        }
    }
}
