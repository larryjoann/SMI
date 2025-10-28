using System;
using api_SMI.Models;
using api_SMI.Repositories;

namespace api_SMI.Services
{
    public class CommentaireNcService : ICommentaireNcService
    {
        private readonly CommentaireNcRepository _repository;
        private readonly IHistoriqueService _historiqueService;

        public CommentaireNcService(CommentaireNcRepository repository , IHistoriqueService historiqueService)
        {
            _historiqueService = historiqueService;
            _repository = repository;
        }

        public IEnumerable<CommentaireNc> GetAll() => _repository.GetAll();

        public CommentaireNc? GetById(int id) => _repository.GetById(id);

        public IEnumerable<CommentaireNc> GetByNc(int idNc) => _repository.GetByNc(idNc);

        public void Add(CommentaireNc entity) {
            entity.DateTimeCommentaire = DateTime.Now;
            _repository.Add(entity);

            _historiqueService.Add(new Historique
            {
                MatriculeCollaborateur = entity.MatriculeCollaborateur,
                IdOperation = 1, 
                Datetime = DateTime.Now,
                IdEntite = 2, 
                IdObject = entity.IdNc,
                Descr = "Ajout d'un commentaire à la non-conformité",
            });
        } 

        public void Update(CommentaireNc entity)
        {
            entity.DateTimeCommentaire = DateTime.Now;
            _repository.Update(entity);
        }

        public void Delete(int id) => _repository.Delete(id);
    }
}
