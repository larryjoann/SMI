using System.DirectoryServices;

namespace habilitation_back.Models.Authentication
{
    public class Login
    {
        public string? Matricule { get; set; }
        public string? Password { get; set; }
        public string? Mail { get; set; }
        public bool IsValid()
        {
            try
            {
                string ldapPath = "LDAP://corp.ravinala";
                using var entry = new DirectoryEntry(ldapPath, Matricule, Password, AuthenticationTypes.Secure);
                DirectorySearcher ds = new DirectorySearcher(entry);
                ds.FindOne();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(Matricule))
            {
                throw new ArgumentException("Le matricule ne peut pas être vide");
            }

            if (string.IsNullOrWhiteSpace(Password))
            {
                throw new ArgumentException("Le mot de passe ne peut pas être vide");
            }
        }

    }

}
