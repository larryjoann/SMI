using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CauseNcService : ICauseNcService
    {
        private readonly CauseNcRepository _repository;
        private readonly INonConformiteService _nonConformiteService;
        private readonly IHistoriqueService _historiqueService;

        public CauseNcService(CauseNcRepository repository, INonConformiteService nonConformiteService, IHistoriqueService historiqueService)
        {
            _historiqueService = historiqueService;
            _repository = repository;
            _nonConformiteService = nonConformiteService;
        }

        public IEnumerable<CauseNc> GetAll() => _repository.GetAll();

        public IEnumerable<CauseNc> GetByNc(int id_nc)
            => _repository.GetByNc(id_nc);

        public CauseNc? GetById(int id) => _repository.GetById(id);



        public void Add(CauseNc entity) => _repository.Add(entity);

        public void Update(CauseNc entity) => _repository.Update(entity);

        public void Delete(int id) => _repository.Delete(id);

        public void UpdateByNc(int id_nc, List<CauseNc> entities , string matricule) {
            NonConformite? nc = _nonConformiteService.GetById(id_nc);
            if (nc != null)
            {
                nc.IdStatusNc = 5;
                _nonConformiteService.Update(nc);
            }

            _repository.DeleteByNc(id_nc);
            _repository.AddRange(entities);

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = matricule,
                IdOperation = 2, 
                Datetime = DateTime.Now,
                IdEntite = 2, 
                IdObject = id_nc,
                Descr = "Mise à jour des causes de la non-conformité",
            });
        }
    }
}
