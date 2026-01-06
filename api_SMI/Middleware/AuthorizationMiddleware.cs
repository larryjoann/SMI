using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using api_SMI.Attributes;
using api_SMI.Services.Authorization;

namespace api_SMI.Middleware
{
    public class AuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Let CORS preflight (OPTIONS) pass through without enforcing authorization here.
            // In some hosting setups the middleware chain may still reach this middleware
            // for preflight requests; short-circuiting prevents returning 401/403 that
            // would break the browser CORS check.
            if (context.Request.Method == HttpMethods.Options)
            {
                await _next(context);
                return;
            }
            var endpoint = context.GetEndpoint();
            var requirePermission = endpoint?.Metadata.GetMetadata<RequirePermissionAttribute>();

            if (requirePermission != null && requirePermission.Permissions?.Length > 0)
            {
                string? matricule = null;

                if (context.User?.Identity != null && context.User.Identity.IsAuthenticated)
                {
                    matricule = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                ?? context.User.FindFirst("matricule")?.Value
                                ?? context.User.Identity.Name;
                }

                if (string.IsNullOrEmpty(matricule))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Unauthenticated");
                    return;
                }

                // Récupérer le service scoped ici
                var authService = context.RequestServices.GetService(typeof(IAuthorizationService)) as IAuthorizationService;
                if (authService == null)
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    await context.Response.WriteAsync("Authorization service not available");
                    return;
                }

                foreach (var perm in requirePermission.Permissions.Where(p => !string.IsNullOrEmpty(p)))
                {
                    var ok = await authService.HasPermissionAsync(matricule, perm);
                    if (!ok)
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsync("Forbidden");
                        return;
                    }
                }
            }

            await _next(context);
        }
    }
}