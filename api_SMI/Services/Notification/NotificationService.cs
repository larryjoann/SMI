using api_SMI.Models;
using api_SMI.Repositories;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificationRepository _repo;

        public NotificationService(NotificationRepository repo)
        {
            _repo = repo;
        }

        public IEnumerable<Notification> GetAll() => _repo.GetAll();

        public Notification? GetById(int id) => _repo.GetById(id);

        public void Add(Notification notification)
        {
            _repo.Add(notification);
        }

        public void Update(Notification notification)
        {
            _repo.Update(notification);
        }

        public void Delete(int id)
        {
            _repo.Delete(id);
        }

        public IEnumerable<Notification> GetByCollaborator(string matricule)
            => _repo.GetByCollaborator(matricule);

        public IEnumerable<Notification> GetUnreadByCollaborator(string matricule)
            => _repo.GetUnreadByCollaborator(matricule);

        public IEnumerable<Notification> GetByEntityObject(int idEntite, int idObject)
            => _repo.GetByEntityObject(idEntite, idObject);

        public int GetUnreadCountByCollaborator(string matricule)
            => _repo.GetUnreadCountByCollaborator(matricule);

        public void MarkAllAsReadByCollaborator(string matricule)
            => _repo.MarkAllAsReadByCollaborator(matricule);


        //personnalisé
        public void notif_nc_declare(NonConformite nc)
        {
            var notif = new Notification
            {
                MatriculeCollaborateur = "00005",
                Titre = "Nouvelle non-conformité déclarée",
                Contenu = $"Une nouvelle non-conformité a été déclarée par {nc.Emetteur?.NomAffichage ?? nc.MatriculeEmetteur ?? "utilisateur"}.",
                Lue = false,
                IdEntite = 2, // Entite 'Non-conformité' as per schema
                IdObject = nc.Id
            };
            Add(notif);
        }
    }
}
