using api_SMI.Models;

namespace api_SMI.Services
{
    public class NCDetailsService : INCDetailsService
    {
        private readonly INonConformiteService _ncService;
        private readonly IPieceJointeNcService _pjService;
        private readonly IProcessusConcerneNcService _processusConcerneService;

        public NCDetailsService(
            INonConformiteService ncService,
            IPieceJointeNcService pjService,
            IProcessusConcerneNcService processusConcerneService)
        {
            _ncService = ncService;
            _pjService = pjService;
            _processusConcerneService = processusConcerneService;
        }

        public NCDetails? GetDetails(int ncId)
        {
            var nc = _ncService.GetById(ncId);
            if (nc == null) return null;

            var pieces = _pjService.GetByNonConformite(ncId).ToList();
            var processusConcerne = _processusConcerneService.GetByNonConformite(ncId).ToList();

            return new NCDetails
            {
                NC = nc,
                PiecesJointes = pieces,
                ProcessusConcerne = processusConcerne
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
    }
}