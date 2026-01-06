using Microsoft.AspNetCore.Mvc;
using api_SMI.Models;
using api_SMI.Services;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace api_SMI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LoginService _loginService;

        public AuthController(LoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginModel)
        {
            try
            { 
                _loginService.Validate(loginModel);
                if (_loginService.IsValid(loginModel))
                {
                        // authentification basée sur JWT; pas de session côté serveur
                    // génération du JWT
                    var jwt = _loginService.GenerateJwt(loginModel.matricule ?? "");
                    return Ok(new { message = "Authentification réussie.", token = jwt });
                }
                else
                {
                    return Unauthorized(new { message = "Matricule ou mot de passe incorrect." });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            // Stateless JWT: logout is handled client-side by deleting the token; server-side revocation not implemented here.
            return Ok(new { message = "Déconnexion : supprimer le token côté client." });
        }
    }
}
