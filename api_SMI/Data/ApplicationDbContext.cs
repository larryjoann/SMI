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
        // Ajoute d'autres DbSet si besoin
        public DbSet<Pilote> Pilotes { get; set; }
        public DbSet<Copilote> Copilotes { get; set; }
    }
}