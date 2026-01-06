using System.Security.Claims;

namespace api_SMI.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string? GetMatricule(this ClaimsPrincipal user)
        {
            if (user == null) return null;
            var matricule = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(matricule)) return matricule;
            matricule = user.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            return matricule;
        }
    }
}
