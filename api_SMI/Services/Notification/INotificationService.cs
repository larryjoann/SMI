using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Services
{
    public interface INotificationService
    {
        IEnumerable<Notification> GetAll();
        Notification? GetById(int id);
        void Add(Notification notification);
        void Update(Notification notification);
        void Delete(int id);
        IEnumerable<Notification> GetByCollaborator(string matricule);
        IEnumerable<Notification> GetUnreadByCollaborator(string matricule);
        IEnumerable<Notification> GetByEntityObject(int idEntite, int idObject);
        int GetUnreadCountByCollaborator(string matricule);
        void MarkAllAsReadByCollaborator(string matricule);

        void notif_nc_declare(NonConformite nc);
    }
}
