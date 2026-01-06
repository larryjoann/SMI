using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;

namespace api_SMI.Repositories
{
    public class ProcessusConcerneNcRepository
    {
        private readonly ApplicationDbContext _context;

        public ProcessusConcerneNcRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<ProcessusConcerneNc> GetAll()
            => _context.Set<ProcessusConcerneNc>()
                // .Include(p => p.NonConformite)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.TypeResponsableProcessus)
                .ToList();

        public ProcessusConcerneNc? GetById(int id)
        {
            return _context.Set<ProcessusConcerneNc>()
                // .Include(p => p.NonConformite)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.TypeResponsableProcessus)
                .FirstOrDefault(p => p.Id == id);
        }

        public void Add(ProcessusConcerneNc entity)
        {
            _context.Set<ProcessusConcerneNc>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<ProcessusConcerneNc> entities)
        {
            _context.Set<ProcessusConcerneNc>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(ProcessusConcerneNc entity)
        {
            _context.Set<ProcessusConcerneNc>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<ProcessusConcerneNc>().Remove(entity);
                _context.SaveChanges();
            }
        }

        public void DeleteAll()
        {
            _context.Set<ProcessusConcerneNc>().RemoveRange(_context.Set<ProcessusConcerneNc>());
            _context.SaveChanges();
        }

        public List<ProcessusConcerneNc> GetByNonConformite(int idNc)
        {
            return _context.Set<ProcessusConcerneNc>()
                .Where(p => p.IdNc == idNc)
                // .Include(p => p.NonConformite)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.TypeResponsableProcessus)
                .ToList();
        }

        public List<ProcessusConcerneNc> GetByMatricule(string matricule)
        {
            return _context.Set<ProcessusConcerneNc>()
                // include processus and their responsible processes/collaborateurs
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.ResponsablesProcessus!)
                        .ThenInclude(rp => rp.TypeResponsableProcessus)
                // filter where the given matricule is a responsible for the processus
                .Where(p => p.Processus != null && (
                    p.Processus.ResponsablesProcessus != null && 
                    p.Processus.ResponsablesProcessus.Any(rp => rp.MatriculeCollaborateur == matricule)
                ))
                .ToList();
        }

        public void DeleteByNonConformite(int idNc)
        {
            var entities = _context.Set<ProcessusConcerneNc>().Where(p => p.IdNc == idNc);
            _context.Set<ProcessusConcerneNc>().RemoveRange(entities);
            _context.SaveChanges();
        }
    }
}