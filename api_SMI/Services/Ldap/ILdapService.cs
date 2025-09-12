using api_SMI.Models;
using System.Collections.Generic;

namespace api_SMI.Ldap
{
    public interface ILdapService
    {
        List<Collaborateur> GetCollaborateursFromActiveDirectory(string domainPath);
    }
}