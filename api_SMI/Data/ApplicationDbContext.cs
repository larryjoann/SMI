using Microsoft.EntityFrameworkCore;
using api_SMI.Models;

namespace api_SMI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Collaborateur> Collaborateurs { get; set; }
        public DbSet<CategorieProcessus> CategorieProcessus { get; set; }
        public DbSet<Processus> Processus { get; set; }
        public DbSet<CategoriePermission> CategoriePermission { get; set; }
        public DbSet<Permission> Permission { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<RolePermission> RolePermission { get; set; }
        public DbSet<RoleCollaborateur> RoleCollaborateur { get; set; }
        public DbSet<Pilote> Pilotes { get; set; }
        public DbSet<Copilote> Copilotes { get; set; }
        public DbSet<Lieu> Lieux { get; set; }
        public DbSet<TypeNc> TypeNcs { get; set; }
        public DbSet<NonConformite> NonConformites { get; set; }
        public DbSet<ProcessusConcerneNc> ProcessusConcerneNcs { get; set; }
        public DbSet<StatusNc> StatusNcs { get; set; }
        public DbSet<PrioriteNc> PrioriteNcs { get; set; }
        public DbSet<PieceJointeNc> PieceJointeNcs { get; set; }
        public DbSet<PhaseNc> PhaseNcs { get; set; } 
        public DbSet<CategorieCauseNc> CategorieCauseNcs { get; set; }
        public DbSet<CauseNc> CauseNcs { get; set; } 
        public DbSet<CommentaireNc> CommentaireNcs { get; set; }
        public DbSet<Entite> Entites { get; set; }
        public DbSet<Operation> Operations { get; set; }
        public DbSet<Historique> Historiques { get; set; }
        public DbSet<ValiditeProcessus> ValiditeProcessus { get; set; }
        public DbSet<StatusAction> StatusActions { get; set; }
        public DbSet<api_SMI.Models.Action> Actions { get; set; }
        public DbSet<SuiviAction> SuiviActions { get; set; }
        public DbSet<SourceAction> SourceActions { get; set; }
        public DbSet<ResponsableAction> ResponsableActions { get; set; }
    
        
    }
}