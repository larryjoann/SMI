using api_SMI.Models;
using System;
using System.DirectoryServices;

namespace api_SMI.Services
{
    public class LoginService
    {
        private readonly Microsoft.Extensions.Configuration.IConfiguration _config;

        public LoginService(Microsoft.Extensions.Configuration.IConfiguration config)
        {
            _config = config;
        }
        public void Validate(Login login)
        {
            if (string.IsNullOrWhiteSpace(login.matricule) && string.IsNullOrWhiteSpace(login.password))
                throw new Exception("Le matricule et le mot de passe sont obligatoires.");
            if (string.IsNullOrWhiteSpace(login.matricule))
                throw new Exception("Le matricule est obligatoire.");
            if (string.IsNullOrWhiteSpace(login.password))
                throw new Exception("Le mot de passe est obligatoire.");
        }

        public bool IsValid(Login login)
        {
            try
            {
                Console.WriteLine($"Tentative de connexion LDAP pour l'utilisateur : {login.matricule}");
                string ldapPath = "LDAP://corp.ravinala";
                using var entry = new DirectoryEntry(ldapPath, login.matricule, login.password, AuthenticationTypes.Secure);
                DirectorySearcher ds = new DirectorySearcher(entry);
                ds.FindOne();
                Console.WriteLine($"Connexion LDAP réussie pour l'utilisateur : {login.matricule}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Échec de la connexion LDAP pour l'utilisateur : {login.matricule} - Erreur : {ex.Message}");
                return false;
                //return true;
            }
        }
        public string GenerateJwt(string matricule)
        {
            var secretKey = _config["Jwt:Key"] ?? "votre_cle_secrete_super_longue_et_complexe";
            var issuer = _config["Jwt:Issuer"] ?? "api_SMI";
            var audience = _config["Jwt:Audience"] ?? "api_SMI_client";
            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, matricule ?? ""),
                new System.Security.Claims.Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(15), // Durée de vie courte
                signingCredentials: creds
            );

            return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}