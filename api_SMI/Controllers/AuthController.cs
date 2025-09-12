using Microsoft.AspNetCore.Mvc;
using api_SMI.Models;
using api_SMI.Services;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace api_SMI.Controllers.Auth
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
                    // creation session avec le matricule
                    HttpContext.Session.SetString("matricule", loginModel.matricule ?? "");
                    var matriculeSession = HttpContext.Session.GetString("matricule");
                    Console.WriteLine($"Matricule enregistré en session : {matriculeSession}");

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
            try
            {
                HttpContext.Session.Clear(); // Détruit toute la session
                 Console.WriteLine($"Session détruite, utilisateur déconnecté.");
                return Ok(new { message = "Déconnexion réussie." });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Erreur lors de la déconnexion : " + ex.Message);
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
