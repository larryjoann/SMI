using Microsoft.EntityFrameworkCore;
using api_SMI.Data; // Remplace par ton namespace réel
using api_SMI.Services;
using api_SMI.Models;
using api_SMI.Repositories; 
using api_SMI.Ldap;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Reflection;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Basic OpenAPI info
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "api_SMI", Version = "v1" });

    // JWT Bearer support in Swagger UI
    var securityScheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your token. Example: \"Bearer {token}\""
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    var securityRequirement = new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        { securityScheme, new string[] { } }
    };
    c.AddSecurityRequirement(securityRequirement);

    // Include XML comments if available (requires GenerateDocumentationFile in csproj)
    try
    {
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath);
    }
    catch
    {
        // ignore if reflection/path fails in some environments
    }
});
builder.Services.AddControllers();

// Ajout de l'authentification JWT
var jwtSecret = "votre_cle_secrete_super_longue_et_complexe"; // Doit être identique à celle utilisée pour générer le token
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "api_SMI",
        ValidAudience = "api_SMI_client",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("votre_cle_secrete_super_longue_et_complexe"))
    };
});

// Ajout de la gestion de session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    // Pour que la session fonctionne depuis un front sur une autre origine (ex: http://localhost:3000)
    // il faut autoriser les cookies cross-site et permettre les credentials côté CORS.
    // SameSite=None permet l'envoi du cookie pour les requêtes cross-site (POST via fetch/axios).
    // Configure cookie options depending on environment to avoid modern browsers rejecting cookies
    // that set SameSite=None without Secure=true. In development (HTTP) we use Lax to ensure
    // the cookie is accepted by browsers when running on localhost. In production, allow
    // cross-site cookies but require Secure so SameSite=None is valid.
    if (builder.Environment.IsDevelopment())
    {
        options.Cookie.SameSite = SameSiteMode.Lax;
        // On HTTP local dev, do not force Secure; leave as None so cookie can be used by the dev server.
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    }
    else
    {
        // In production require secure cookies and allow cross-site usage when needed
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    }
});

// Ajoutez cette ligne pour configurer CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000") // adapte selon ton front
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Ajoute cette ligne pour configurer le DbContext avec la chaîne de connexion
// et activer la résilience aux erreurs transitoires (EnableRetryOnFailure)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorNumbersToAdd: null)));

builder.Services.AddScoped<CollaborateurRepository>();
builder.Services.AddScoped<CollaborateurService>();
builder.Services.AddScoped<ILdapService, LdapService>();
builder.Services.AddScoped<LoginService>();
builder.Services.AddScoped<CategorieProcessusRepository>();
builder.Services.AddScoped<CategorieProcessusService>();
builder.Services.AddScoped<ProcessusRepository>();
builder.Services.AddScoped<ProcessusService>();
builder.Services.AddScoped<CategoriePermissionRepository>();
builder.Services.AddScoped<CategoriePermissionService>();
builder.Services.AddScoped<PermissionRepository>();
builder.Services.AddScoped<PermissionService>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<RolePermissionRepository>();
builder.Services.AddScoped<RolePermissionService>();    
builder.Services.AddScoped<RoleCollaborateurRepository>();
builder.Services.AddScoped<RoleCollaborateurService>(); 
builder.Services.AddScoped<PiloteRepository>();
builder.Services.AddScoped<PiloteService>();            
builder.Services.AddScoped<CopiloteRepository>();
builder.Services.AddScoped<CopiloteService>();
builder.Services.AddScoped<ILieuService, LieuService>();
builder.Services.AddScoped<LieuRepository>();   
builder.Services.AddScoped<ITypeNcService, TypeNcService>();
builder.Services.AddScoped<TypeNcRepository>();
builder.Services.AddScoped<INonConformiteService, NonConformiteService>();
builder.Services.AddScoped<NonConformiteRepository>();        
builder.Services.AddScoped<IProcessusConcerneNcService, ProcessusConcerneNcService>();
builder.Services.AddScoped<ProcessusConcerneNcRepository>();
builder.Services.AddScoped<IStatusNcService, StatusNcService>();
builder.Services.AddScoped<StatusNcRepository>();
builder.Services.AddScoped<IPrioriteNcService, PrioriteNcService>();
builder.Services.AddScoped<PrioriteNcRepository>();
builder.Services.AddScoped<IPieceJointeNcService, PieceJointeNcService>();
builder.Services.AddScoped<PieceJointeNcRepository>();
builder.Services.AddScoped<INCDetailsService, NCDetailsService>();
builder.Services.AddScoped<IPhaseNcService, PhaseNcService>();
builder.Services.AddScoped<PhaseNcRepository>();
builder.Services.AddScoped<CategorieCauseNcRepository>();
builder.Services.AddScoped<ICategorieCauseNcService, CategorieCauseNcService>();
builder.Services.AddScoped<CauseNcRepository>();
builder.Services.AddScoped<ICauseNcService, CauseNcService>();
builder.Services.AddScoped<CommentaireNcRepository>();
builder.Services.AddScoped<ICommentaireNcService, CommentaireNcService>();
builder.Services.AddScoped<INCDetailsService, NCDetailsService>();
builder.Services.AddScoped<IHistoriqueService, HistoriqueService>();
builder.Services.AddScoped<HistoriqueRepository>();
builder.Services.AddScoped<ValiditeProcessusRepository>();
builder.Services.AddScoped<IValiditeProcessusService, ValiditeProcessusService>();
builder.Services.AddScoped<ValiditeProcessusService>();
builder.Services.AddScoped<ActionRepository>();
builder.Services.AddScoped<IActionService, ActionService>();
builder.Services.AddScoped<SuiviActionRepository>();
builder.Services.AddScoped<ISuiviActionService, SuiviActionService>();
builder.Services.AddScoped<SourceActionRepository>();
builder.Services.AddScoped<ISourceActionService, SourceActionService>();
builder.Services.AddScoped<ResponsableActionRepository>();
builder.Services.AddScoped<IResponsableActionService, ResponsableActionService>();
builder.Services.AddScoped<StatusActionRepository>();
builder.Services.AddScoped<IStatusActionService, StatusActionService>();

var app = builder.Build();

// Test de connexion à la base de données au démarrage
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    api_SMI.DbConnectionTest.Test(services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowReact");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

Console.WriteLine("API démarrée");
app.MapControllers();
app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
