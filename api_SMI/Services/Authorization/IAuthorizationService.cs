using System.Collections.Generic;
using System.Threading.Tasks;

namespace api_SMI.Services.Authorization
{
    public interface IAuthorizationService
    {
        Task<bool> HasPermissionAsync(string matricule, string permissionReference);
        Task<IEnumerable<string>> GetPermissionsAsync(string matricule);
    }
}