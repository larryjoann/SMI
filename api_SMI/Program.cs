using Microsoft.EntityFrameworkCore;
using api_SMI.Data; // Remplace par ton namespace réel
using api_SMI.Services;
using api_SMI.Models;
using api_SMI.Repositories; 
using api_SMI.Ldap;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
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
    options.Cookie.SameSite = SameSiteMode.Lax; // Lax autorise le cookie sur HTTP cross-origin
    options.Cookie.SecurePolicy = CookieSecurePolicy.None; // Autorise le cookie sur HTTP
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
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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
