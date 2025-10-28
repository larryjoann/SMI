using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class NonConformiteService : INonConformiteService
    {
        private readonly NonConformiteRepository _repository;
        private readonly IProcessusConcerneNcService _processusConcerneNcService;

        public NonConformiteService(NonConformiteRepository repository, IProcessusConcerneNcService processusConcerneNcService)
        {
            _repository = repository;
            _processusConcerneNcService = processusConcerneNcService;
        }

        public List<NonConformite> GetAll() => _repository.GetAll();

        public NonConformite? GetById(int id) => _repository.GetById(id);

        public void Declare(NonConformite nonConformite)
        {
            nonConformite.DateTimeCreation = DateTime.Now;
            nonConformite.DateTimeDeclare = DateTime.Now;
            nonConformite.Status = true;
            nonConformite.IdStatusNc = 1; 
            nonConformite.IdPrioriteNc = null;
            _repository.Add(nonConformite);
        }

        public void Draft(NonConformite nonConformite)
        {
            nonConformite.DateTimeCreation = DateTime.Now;
            nonConformite.DateTimeDeclare = null;
            nonConformite.Status = true;
            nonConformite.IdStatusNc = null;
            nonConformite.IdPrioriteNc = null;
            _repository.Add(nonConformite);
        }

        public void DraftToDeclare(NonConformite nonConformite)
        {
            nonConformite.DateTimeDeclare = DateTime.Now;
            _repository.Update(nonConformite);
        }

        public void AddRange(List<NonConformite> nonConformiteList) => _repository.AddRange(nonConformiteList);

        public void Update(NonConformite nonConformite) => _repository.Update(nonConformite);

        public void Delete(int id) => _repository.Delete(id);

        public void DeleteAll() => _repository.DeleteAll();

        public List<NonConformite> GetDrafts(string matricule_emetteur) => _repository.GetDrafts(matricule_emetteur);

        public List<NonConformite> GetDeclare(string matricule_emetteur) => _repository.GetDeclare(matricule_emetteur);

        public List<NonConformite> GetArchived(string matricule_emetteur) => _repository.GetArchived(matricule_emetteur);

        public List<NonConformite> GetAllByMatricule(string matricule_emetteur)
        {
            // NC declared by this matricule (as emitter)
            List<NonConformite> NC_declare = _repository.GetDeclare(matricule_emetteur);

            // Processus concerned where this matricule is pilot or copilote
            List<ProcessusConcerneNc> PCNC_list = _processusConcerneNcService.GetByMatricule(matricule_emetteur);

            // Collect distinct NC ids from the processus concerned list
            var ncIdsFromProcessus = PCNC_list.Select(p => p.IdNc).Distinct();

            // Fetch NonConformite for those ids, keeping only declared & active entries
            var NC_from_processus = new List<NonConformite>();
            foreach (var id in ncIdsFromProcessus)
            {
                var nc = _repository.GetById(id);
                if (nc != null && nc.Status == true && nc.DateTimeDeclare != null)
                {
                    NC_from_processus.Add(nc);
                }
            }

            // Merge declared NCs and NCs found via processus (avoid duplicates by Id)
            var result = NC_declare.Concat(NC_from_processus)
                .GroupBy(n => n.Id)
                .Select(g => g.First())
                .OrderByDescending(nc => nc.DateTimeDeclare)
                .ToList();

            return result;
        }
        public void Archiver(int id)
        {
            _repository.Archiver(id);
        }

        public void Restorer(int id)
        {
            _repository.Restorer(id);
        }
        
        public void Qualifier(NonConformite nonConformite , int idStatusNc)
        {
            nonConformite.IdStatusNc = idStatusNc;
            _repository.Update(nonConformite);
        }
        
    }
}