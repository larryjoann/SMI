using api_SMI.Models;
using System.DirectoryServices;
using System.Runtime.InteropServices;

namespace api_SMI.Ldap
{
    public class LdapService : ILdapService
    {
        public List<Collaborateur> GetCollaborateursFromActiveDirectory(string domainPath)
        {
            if (string.IsNullOrWhiteSpace(domainPath))
                throw new ArgumentException("Domain path cannot be null or empty.", nameof(domainPath));

            if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                throw new PlatformNotSupportedException("Active Directory access is only supported on Windows.");

            List<Collaborateur> collaborateurs = new();
            try
            {
                using var entry = new DirectoryEntry(domainPath, "ST151", "LewisHamilton77!?");
                using var searcher = new DirectorySearcher(entry);
                searcher.Filter = "(objectClass=user)";
                searcher.PageSize = 2000;
                searcher.PropertiesToLoad.AddRange(new[]
                {
                    "displayName", "mail", "title", "name", "department","userAccountControl", "sAMAccountName", "telephoneNumber"
                });

                foreach (SearchResult result in searcher.FindAll())
                {
                    using var userEntry = result.GetDirectoryEntry();
                    collaborateurs.Add(new Collaborateur
                    {
                        Matricule = userEntry.Properties["sAMAccountName"]?.Value?.ToString() ?? "",
                        NomComplet = userEntry.Properties["name"]?.Value?.ToString() ?? "",
                        NomAffichage = userEntry.Properties["displayName"]?.Value?.ToString() ?? "",
                        Departement = userEntry.Properties["department"]?.Value?.ToString() ?? "",
                        Poste = userEntry.Properties["title"]?.Value?.ToString() ?? "",
                        Courriel = userEntry.Properties["mail"]?.Value?.ToString() ?? "",
                        Telephone = userEntry.Properties["telephoneNumber"]?.Value?.ToString() ?? "",
                        Etat = userEntry.Properties["userAccountControl"]?.Value is int uac && (uac & 2) == 0 ? 1 : 0
                    });
                }
            }
            catch (DirectoryServicesCOMException ex)
            {
                Console.WriteLine($"AD Error: {ex.Message}");
                throw new InvalidOperationException("Failed to access Active Directory.", ex);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected AD Error: {ex.Message}");
                throw;
            }
            Console.WriteLine($"Collaborateur recollté avec succes");
            return collaborateurs;
        }
    }
}