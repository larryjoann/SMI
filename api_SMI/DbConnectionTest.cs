using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using api_SMI.Data;

namespace api_SMI
{
    public class DbConnectionTest
    {
        public static void Test(IServiceProvider serviceProvider)
        {
            try
            {
                var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
                context.Database.OpenConnection();
                Console.WriteLine("Test connexion à la base de données réussie !");

                // Lister les tables existantes
                var tables = context.Database.ExecuteSqlRaw(
                    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'");
                using (var command = context.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
                    using (var reader = command.ExecuteReader())
                    {
                        Console.WriteLine("Tables existantes dans la base de données :");
                        while (reader.Read())
                        {
                            Console.WriteLine($"- {reader.GetString(0)}");
                        }
                    }
                }

                context.Database.CloseConnection();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur du test de connexion à la base de données : {ex.Message}");
            }
        }
    }
}
