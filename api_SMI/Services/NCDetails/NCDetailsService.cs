using api_SMI.Models;

namespace api_SMI.Services
{

    public class NCDetailsService : INCDetailsService
    {
        private readonly INonConformiteService _ncService;
        private readonly IPieceJointeNcService _pjService;
        private readonly IProcessusConcerneNcService _processusConcerneService;
        private readonly ICauseNcService _causeNcService;
        private readonly ICommentaireNcService _commentaireNcService;
        private readonly IHistoriqueService _historiqueService;

        public NCDetailsService(
            INonConformiteService ncService,
            IPieceJointeNcService pjService,
            ICauseNcService causeNcService,
            ICommentaireNcService commentaireNcService,
            IHistoriqueService historiqueService,
            IProcessusConcerneNcService processusConcerneService)
        {
            _ncService = ncService;
            _pjService = pjService;
            _causeNcService = causeNcService;
            _commentaireNcService = commentaireNcService;
            _historiqueService = historiqueService;
            _processusConcerneService = processusConcerneService;

        }

        public NCDetails? GetDetails(int ncId)
        {
            var nc = _ncService.GetById(ncId);
            if (nc == null) return null;

            var pieces = _pjService.GetByNonConformite(ncId).ToList();
            var processusConcerne = _processusConcerneService.GetByNonConformite(ncId).ToList();
            var causes = _causeNcService.GetByNc(ncId).ToList();
            var commentaires = _commentaireNcService.GetByNc(ncId).ToList();

            return new NCDetails
            {
                NC = nc,
                PiecesJointes = pieces,
                ProcessusConcerne = processusConcerne,
                Causes = causes,
                Commentaires = commentaires
            };
        }

        public IEnumerable<NCDetails> GetAll()
        {
            var allNc = _ncService.GetAll();
            var result = new List<NCDetails>();

            foreach (var nc in allNc)
            {
                var pieces = _pjService.GetByNonConformite(nc.Id).ToList();
                var processusConcerne = _processusConcerneService.GetByNonConformite(nc.Id).ToList();

                result.Add(new NCDetails
                {
                    NC = nc,
                    PiecesJointes = pieces,
                    ProcessusConcerne = processusConcerne
                });
            }

            return result;
        }

        public IEnumerable<NCDetails> GetAllByMatricule(string matricule_emetteur)
        {
            var allNc = _ncService.GetAllByMatricule(matricule_emetteur);
            var result = new List<NCDetails>();

            foreach (var nc in allNc)
            {
                var pieces = _pjService.GetByNonConformite(nc.Id).ToList();
                var processusConcerne = _processusConcerneService.GetByNonConformite(nc.Id).ToList();

                result.Add(new NCDetails
                {
                    NC = nc,
                    PiecesJointes = pieces,
                    ProcessusConcerne = processusConcerne
                });
            }

            return result;
        }

        public IEnumerable<NCDetails> GetDrafts(string matricule_emetteur)
        {
            var allNc = _ncService.GetDrafts(matricule_emetteur);
            var result = new List<NCDetails>();

            foreach (var nc in allNc)
            {
                var pieces = _pjService.GetByNonConformite(nc.Id).ToList();
                var processusConcerne = _processusConcerneService.GetByNonConformite(nc.Id).ToList();

                result.Add(new NCDetails
                {
                    NC = nc,
                    PiecesJointes = pieces,
                    ProcessusConcerne = processusConcerne
                });
            }

            return result;
        }

        public IEnumerable<NCDetails> GetDeclare(string matricule_emetteur)
        {
            var allNc = _ncService.GetDeclare(matricule_emetteur);
            var result = new List<NCDetails>();

            foreach (var nc in allNc)
            {
                var pieces = _pjService.GetByNonConformite(nc.Id).ToList();
                var processusConcerne = _processusConcerneService.GetByNonConformite(nc.Id).ToList();

                result.Add(new NCDetails
                {
                    NC = nc,
                    PiecesJointes = pieces,
                    ProcessusConcerne = processusConcerne
                });
            }

            return result;
        }

        public IEnumerable<NCDetails> GetArchived(string matricule_emetteur)
        {
            var allNc = _ncService.GetArchived(matricule_emetteur);
            var result = new List<NCDetails>();

            foreach (var nc in allNc)
            {
                var pieces = _pjService.GetByNonConformite(nc.Id).ToList();
                var processusConcerne = _processusConcerneService.GetByNonConformite(nc.Id).ToList();

                result.Add(new NCDetails
                {
                    NC = nc,
                    PiecesJointes = pieces,
                    ProcessusConcerne = processusConcerne
                });
            }

            return result;
        }


        public void Archiver(int ncId, string matricule)
        {
            _ncService.Archiver(ncId);
            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 3, 
                Datetime = DateTime.Now,
                IdEntite = 2, 
                IdObject = ncId,
                Descr = "Archivage de la non-conformité",
            });
        }

        public void Restorer(int ncId, string matricule)
        {
            _ncService.Restorer(ncId);
            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 2, 
                Datetime = DateTime.Now,
                IdEntite = 2, 
                IdObject = ncId,
                Descr = "Restauration de la non-conformité",
            });

        }


        public void Declare(NCDetails details, string matricule)
        {
            if (details == null || details.NC == null)
                throw new ArgumentException("NCDetails ou NonConformite manquant");

            // 1. Créer la non-conformité
            _ncService.Declare(details.NC);

            // 2. Récupérer l'id créé (supposons qu'il est mis à jour dans details.NC.Id)
            var ncId = details.NC.Id;

            // 3. Ajouter les pièces jointes
            if (details.PiecesJointes != null)
            {
                foreach (var pj in details.PiecesJointes)
                {
                    pj.IdNc = ncId;
                    _pjService.Add(pj);
                }
            }

            // 4. Ajouter les processus concernés
            if (details.ProcessusConcerne != null)
            {
                foreach (var proc in details.ProcessusConcerne)
                {
                    proc.IdNc = ncId;
                    _processusConcerneService.Add(proc);
                }
            }

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 1, // Archiver
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = ncId,
                Descr = "Déclaration de la non-conformité",
            });
        }

        public void Draft(NCDetails details, string matricule)
        {
            if (details == null || details.NC == null)
                throw new ArgumentException("NCDetails ou NonConformite manquant");

            // 1. Créer la non-conformité
            _ncService.Draft(details.NC);

            // 2. Récupérer l'id créé (supposons qu'il est mis à jour dans details.NC.Id)
            var ncId = details.NC.Id;

            // 3. Ajouter les pièces jointes
            if (details.PiecesJointes != null)
            {
                foreach (var pj in details.PiecesJointes)
                {
                    pj.IdNc = ncId;
                    _pjService.Add(pj);
                }
            }

            // 4. Ajouter les processus concernés
            if (details.ProcessusConcerne != null)
            {
                foreach (var proc in details.ProcessusConcerne)
                {
                    proc.IdNc = ncId;
                    _processusConcerneService.Add(proc);
                }
            }

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 1, 
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = ncId,
                Descr = "Déclaration de la non-conformité en brouillon",
            });
        }

        public void DraftToDeclare(NCDetails details , string matricule)
        {
            if (details == null || details.NC == null)
                throw new ArgumentException("NCDetails ou NonConformite manquant");

            // 1. Créer la non-conformité
            _ncService.DraftToDeclare(details.NC);

            // 2. Récupérer l'id créé (supposons qu'il est mis à jour dans details.NC.Id)
            var ncId = details.NC.Id;

            // 3. supprimer les pj
            _pjService.DeleteByNonConformite(ncId);
            if (details.PiecesJointes != null)
            {
                foreach (var pj in details.PiecesJointes)
                {
                    pj.IdNc = ncId;
                    _pjService.Add(pj);
                }
            }

            // supprimer les processus concernés
            _processusConcerneService.DeleteByNonConformite(ncId);
            if (details.ProcessusConcerne != null)
            {
                foreach (var proc in details.ProcessusConcerne)
                {
                    proc.IdNc = ncId;
                    _processusConcerneService.Add(proc);
                }
            }

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 2, // Archiver
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = ncId,
                Descr = "Passage de brouillon à déclaré de la non-conformité",
            });
        }

        public void Update(NCDetails details , string matricule)
        {
            if (details == null || details.NC == null)
                throw new ArgumentException("NCDetails ou NonConformite manquant");

            // 1. Mettre à jour la non-conformité
            _ncService.Update(details.NC);

            var ncId = details.NC.Id;

            // 2. Mettre à jour les pièces jointes
            _pjService.DeleteByNonConformite(ncId);
            if (details.PiecesJointes != null)
            {
                foreach (var pj in details.PiecesJointes)
                {
                    pj.IdNc = ncId;
                    _pjService.Add(pj);
                }
            }

            // 3. Mettre à jour les processus concernés
            _processusConcerneService.DeleteByNonConformite(ncId);
            if (details.ProcessusConcerne != null)
            {
                foreach (var proc in details.ProcessusConcerne)
                {
                    proc.IdNc = ncId;
                    _processusConcerneService.Add(proc);
                }
            }

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 2, // Archiver
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = ncId,
                Descr = "Mise à jour de la non-conformité",
            });
        }

        public void Qualifier(NCDetails details, int idStatusNc , string matricule)
        {
            if (details == null || details.NC == null)
                throw new ArgumentException("NCDetails ou NonConformite manquant");

            NonConformite nc = _ncService.GetById(details.NC.Id);

            _ncService.Qualifier(nc, idStatusNc);

            // 3. Mettre à jour les processus concernés
            _processusConcerneService.DeleteByNonConformite(details.NC.Id);
            if (details.ProcessusConcerne != null)
            {
                foreach (var proc in details.ProcessusConcerne)
                {
                    proc.IdNc = details.NC.Id;
                    _processusConcerneService.Add(proc);
                }
            }

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 1, // Archiver
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = details.NC.Id,
                Descr = "Qualification de la non-conformité",
            });
        }

        public void UpdateCausesNc(int idNc , List<CauseNc> causes , string matricule)
        {
            _causeNcService.UpdateByNc(idNc, causes,matricule);

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 2, // Archiver
                Datetime = DateTime.Now,
                IdEntite = 2, // NonConformite
                IdObject = idNc,
                Descr = "Mise à jour des causes de la non-conformité",
            });
        }
    }
}