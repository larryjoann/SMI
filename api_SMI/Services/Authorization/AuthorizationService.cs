using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using api_SMI.Data;
using api_SMI.Models;

namespace api_SMI.Services.Authorization
{
    public class AuthorizationService : IAuthorizationService
    {
        private readonly ApplicationDbContext _context;

        public AuthorizationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> HasPermissionAsync(string matricule, string permissionReference)
        {
            if (string.IsNullOrEmpty(matricule) || string.IsNullOrEmpty(permissionReference))
                return false;

            var roleIds = await _context.RoleCollaborateur
                .Where(rc => rc.MatriculeCollaborateur == matricule)
                .Select(rc => rc.IdRole)
                .ToListAsync();
            roleIds.Add(5); // Ajout du rôle "Tous les utilisateurs"

            if (roleIds == null || roleIds.Count == 0)
                return false;

            var permissionIds = await _context.RolePermission
                .Where(rp => roleIds.Contains(rp.IdRole))
                .Select(rp => rp.IdPermission)
                .ToListAsync();

            if (permissionIds == null || permissionIds.Count == 0)
                return false;

            var exists = await _context.Permission
                .AnyAsync(p => permissionIds.Contains(p.Id) && p.Reference == permissionReference);

            return exists;
        }

        public async Task<IEnumerable<string>> GetPermissionsAsync(string matricule)
        {
            if (string.IsNullOrEmpty(matricule))
                return Enumerable.Empty<string>();

            var roleIds = await _context.RoleCollaborateur
                .Where(rc => rc.MatriculeCollaborateur == matricule)
                .Select(rc => rc.IdRole)
                .ToListAsync();

            if (roleIds == null || roleIds.Count == 0)
                return Enumerable.Empty<string>();

            var permissionIds = await _context.RolePermission
                .Where(rp => roleIds.Contains(rp.IdRole))
                .Select(rp => rp.IdPermission)
                .ToListAsync();

            if (permissionIds == null || permissionIds.Count == 0)
                return Enumerable.Empty<string>();

            var permissions = await _context.Permission
                .Where(p => permissionIds.Contains(p.Id))
                .Select(p => p.Reference ?? string.Empty)
                .ToListAsync();

            return permissions.Where(p => !string.IsNullOrEmpty(p));
        }
    }
}