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
                    .ThenInclude(pr => pr.Pilotes!)
                        .ThenInclude(pl => pl.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Copilotes!)
                        .ThenInclude(cp => cp.Collaborateur)
                .ToList();

        public ProcessusConcerneNc? GetById(int id)
        {
            return _context.Set<ProcessusConcerneNc>()
                // .Include(p => p.NonConformite)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Pilotes!)
                        .ThenInclude(pl => pl.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Copilotes!)
                        .ThenInclude(cp => cp.Collaborateur)
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
                    .ThenInclude(pr => pr.Pilotes!)
                        .ThenInclude(pl => pl.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Copilotes!)
                        .ThenInclude(cp => cp.Collaborateur)
                .ToList();
        }

        public List<ProcessusConcerneNc> GetByMatricule(string matricule)
        {
            return _context.Set<ProcessusConcerneNc>()
                // include processus and their pilots/coplots/collaborateurs
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Pilotes!)
                        .ThenInclude(pl => pl.Collaborateur)
                .Include(p => p.Processus!)
                    .ThenInclude(pr => pr.Copilotes!)
                        .ThenInclude(cp => cp.Collaborateur)
                // filter where the given matricule is a pilote or a copilote of the processus
                .Where(p => p.Processus != null && (
                    (p.Processus.Pilotes != null && p.Processus.Pilotes.Any(pl => pl.MatriculeCollaborateur == matricule))
                    || (p.Processus.Copilotes != null && p.Processus.Copilotes.Any(cp => cp.MatriculeCollaborateur == matricule))
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