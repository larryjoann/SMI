using api_SMI.Data;
using api_SMI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace api_SMI.Repositories
{
    public class NotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Notification> GetAll()
            => _context.Set<Notification>()
                .Include(n => n.Entite)
                .OrderByDescending(n => n.DatetimeNotification)
                .ToList();

        public List<Notification> GetByCollaborator(string matricule)
            => _context.Set<Notification>()
                .Include(n => n.Entite)
                .Where(n => n.MatriculeCollaborateur == matricule)
                .OrderByDescending(n => n.DatetimeNotification)
                .ToList();

        public List<Notification> GetUnreadByCollaborator(string matricule)
            => _context.Set<Notification>()
                .Include(n => n.Entite)
                .Where(n => n.MatriculeCollaborateur == matricule && !n.Lue)
                .OrderByDescending(n => n.DatetimeNotification)
                .ToList();

        public int GetUnreadCountByCollaborator(string matricule)
            => _context.Set<Notification>().Count(n => n.MatriculeCollaborateur == matricule && !n.Lue);

        public List<Notification> GetByEntityObject(int idEntite, int idObject)
            => _context.Set<Notification>()
                .Include(n => n.Entite)
                .Where(n => n.IdEntite == idEntite && n.IdObject == idObject)
                .OrderByDescending(n => n.DatetimeNotification)
                .ToList();

        public void MarkAllAsReadByCollaborator(string matricule)
        {
            var items = GetUnreadByCollaborator(matricule);

            if (items.Count == 0) return;

            foreach (var n in items)
            {
                n.Lue = true;
            }

            _context.SaveChanges();
        }

        public Notification? GetById(int id)
            => _context.Set<Notification>()
                .Include(n => n.Entite)
                .FirstOrDefault(n => n.Id == id);

        public void Add(Notification entity)
        {
            if (entity.DatetimeNotification == null || entity.DatetimeNotification == default)
                entity.DatetimeNotification = System.DateTime.Now;
            _context.Set<Notification>().Add(entity);
            _context.SaveChanges();
        }

        public void AddRange(List<Notification> entities)
        {
            _context.Set<Notification>().AddRange(entities);
            _context.SaveChanges();
        }

        public void Update(Notification entity)
        {
            _context.Set<Notification>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                _context.Set<Notification>().Remove(entity);
                _context.SaveChanges();
            }
        }
    }
}
