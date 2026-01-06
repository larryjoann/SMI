using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using api_SMI.Data;
using api_SMI.Services;
using api_SMI.Repositories;
using api_SMI.Ldap;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();


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
        ValidIssuer = configuration["JwtSettings:Issuer"],
        ValidAudience = configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]))
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
    options.AddPolicy("AllowAll",
    builder => builder
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null)));

//Repositories & services (kept as previous, compact list)
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
builder.Services.AddScoped<api_SMI.Services.Authorization.IAuthorizationService, api_SMI.Services.Authorization.AuthorizationService>();
builder.Services.AddScoped<PiloteRepository>();
builder.Services.AddScoped<PiloteService>();
builder.Services.AddScoped<CopiloteRepository>();
builder.Services.AddScoped<CopiloteService>();
builder.Services.AddScoped<TypeResponsableProcessusRepository>();
builder.Services.AddScoped<ITypeResponsableProcessusService, TypeResponsableProcessusService>();
builder.Services.AddScoped<ResponsableProcessusRepository>();
builder.Services.AddScoped<IResponsableProcessusService, ResponsableProcessusService>();
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
builder.Services.AddScoped<StatusPARepository>();
builder.Services.AddScoped<IStatusPAService, StatusPAService>();
builder.Services.AddScoped<SourcePARepository>();
builder.Services.AddScoped<ISourcePAService, SourcePAService>();
builder.Services.AddScoped<PlanActionRepository>();
builder.Services.AddScoped<IPlanActionService, PlanActionService>();
builder.Services.AddScoped<ProcessusConcernePARepository>();
builder.Services.AddScoped<IProcessusConcernePAService, ProcessusConcernePAService>();
builder.Services.AddScoped<NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Repositories & services for new process resources
builder.Services.AddScoped<IntercationRepository>();
builder.Services.AddScoped<IIntercationService, IntercationService>();

builder.Services.AddScoped<CategorieRessourcesRepository>();
builder.Services.AddScoped<ICategorieRessourcesService, CategorieRessourcesService>();

builder.Services.AddScoped<RessourceProcessusRepository>();
builder.Services.AddScoped<IRessourceProcessusService, RessourceProcessusService>();

builder.Services.AddScoped<PartieInteresseAttenteRepository>();
builder.Services.AddScoped<IPartieInteresseAttenteService, PartieInteresseAttenteService>();

builder.Services.AddScoped<ActiviteRepository>();
builder.Services.AddScoped<IActiviteService, ActiviteService>();

var app = builder.Build();

// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

app.UseHttpsRedirection();

app.UseCors();
app.UseCors("AllowAll");

app.UseAuthentication();

app.UseMiddleware<api_SMI.Middleware.AuthorizationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();

