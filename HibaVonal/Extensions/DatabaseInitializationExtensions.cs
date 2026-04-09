using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Seed;

namespace HibaVonal.Extensions
{
    public static class DatabaseInitializationExtensions
    {
        public static async Task InitializeDatabaseAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<HibaVonalDBContext>();

            await DbSeeder.SeedAsync(db);
        }
    }
}