using api_SMI.Models;

namespace api_SMI.Services
{

    public class NCDetailsService : INCDetailsService
    {
        private readonly INonConformiteService _ncService;
        private readonly IPieceJointeNcService _pjService;
        private readonly IProcessusConcerneNcService _processusConcerneService;
        private readonly ICauseNcService _causeNcService;

        public NCDetailsService(
            INonConformiteService ncService,
            IPieceJointeNcService pjService,
            ICauseNcService causeNcService,
            IProcessusConcerneNcService processusConcerneService)
        {
            _ncService = ncService;
            _pjService = pjService;
            _causeNcService = causeNcService;
            _processusConcerneService = processusConcerneService;

        }

        public NCDetails? GetDetails(int ncId)
        {
            var nc = _ncService.GetById(ncId);
            if (nc == null) return null;

            var pieces = _pjService.GetByNonConformite(ncId).ToList();
            var processusConcerne = _processusConcerneService.GetByNonConformite(ncId).ToList();
            var causes = _causeNcService.GetByNc(ncId).ToList();

            return new NCDetails
            {
                NC = nc,
                PiecesJointes = pieces,
                ProcessusConcerne = processusConcerne,
                Causes = causes
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

        public IEnumerable<NCDetails> GetDrafts()
        {
            var allNc = _ncService.GetDrafts();
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

        public IEnumerable<NCDetails> GetDeclare()
        {
            var allNc = _ncService.GetDeclare();
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


        public void Archiver(int ncId)
        {
            _ncService.Archiver(ncId);
        }


        public void Declare(NCDetails details)
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
        }

        public void Draft(NCDetails details)
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
        }

        public void DraftToDeclare(NCDetails details)
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
        }

        public void Update(NCDetails details)
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
        }

        public void Qualifier(NCDetails details, int idStatusNc)
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
        }

        public void UpdateCausesNc(int idNc , List<CauseNc> causes)
        {
            _causeNcService.UpdateByNc(idNc, causes);
        }
    }
}