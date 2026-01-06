using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class NonConformiteService : INonConformiteService
    {
        private readonly NonConformiteRepository _repository;
        private readonly IProcessusConcerneNcService _processusConcerneNcService;
        private readonly INotificationService _notificationService;

        public NonConformiteService(NonConformiteRepository repository, IProcessusConcerneNcService processusConcerneNcService, INotificationService notificationService)
        {
            _repository = repository;
            _processusConcerneNcService = processusConcerneNcService;
            _notificationService = notificationService;
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

            nonConformite = _repository.GetById(nonConformite.Id)!;

            // Send notification to A001 about the new declared non-conformity
            try
            {
                var notif = new Notification
                {
                    MatriculeCollaborateur = "00005",
                    Titre = "Nouvelle non-conformité déclarée",
                    Contenu = $"Une nouvelle non-conformité a été déclarée par {nonConformite.Emetteur?.NomAffichage ?? nonConformite.MatriculeEmetteur ?? "utilisateur"}.",
                    Lue = false,
                    IdEntite = 2, // Entite 'Non-conformité' as per schema
                    IdObject = nonConformite.Id
                };
                _notificationService.Add(notif);
            }
            catch
            {
                // Swallow notification errors to avoid impacting NC creation
            }

            // Email sending was removed; notifications are still created.
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
            try
            {
                var notif = new Notification
                {
                    MatriculeCollaborateur = "00005",
                    Titre = "Nouvelle non-conformité déclarée",
                    Contenu = $"Une non-conformité a été déclarée par {nonConformite.Emetteur?.NomAffichage ?? nonConformite.MatriculeEmetteur ?? "utilisateur"}.",
                    Lue = false,
                    IdEntite = 2,
                    IdObject = nonConformite.Id
                };
                _notificationService.Add(notif);
            }
            catch
            {
                // ignore notification failures
            }
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
            //<NonConformite> NC_declare = _repository.GetDeclare(matricule_emetteur);

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

            var result = NC_from_processus;
                // .GroupBy(n => n.Id)
                // .Select(g => g.First())
                // .OrderByDescending(nc => nc.DateTimeDeclare)
                // .ToList();

            if (matricule_emetteur == "00005")
                result = _repository.GetAll();

            return result;
        }

        public void Archiver(int id)
        {
            _repository.Archiver(id);
        }

        public void Supprimer(int id)
        {
            _repository.Supprimer(id);
        }

        public void Restorer(int id)
        {
            _repository.Restorer(id);
        }
       
        public void Qualifier(NonConformite nonConformite , int idStatusNc)
        {
            nonConformite.IdStatusNc = idStatusNc;
            _repository.Update(nonConformite);
            // Notify the emitter that their NC has been qualified
            try
            {
                var recipient = nonConformite.MatriculeEmetteur ?? nonConformite.Emetteur?.Matricule;
                if (!string.IsNullOrWhiteSpace(recipient))
                {
                    var emitterName = nonConformite.Emetteur?.NomAffichage ?? recipient;
                    var notif = new Notification
                    {
                        MatriculeCollaborateur = recipient,
                        Titre = "Votre non-conformité a été qualifiée",
                        Contenu = $"La non-conformité déclarée a été qualifiée.",
                        Lue = false,
                        IdEntite = 2,
                        IdObject = nonConformite.Id
                    };
                    _notificationService.Add(notif);
                }
            }
            catch
            {
                // ignore notification failures
            }
        }
    }
}