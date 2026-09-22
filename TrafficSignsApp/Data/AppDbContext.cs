using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using TrafficSignsApp.Models;

namespace TrafficSignsApp.Data
{
    // Το DbContext είναι η κλάση της Microsoft που διαχειρίζεται τη Βάση
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Λέμε στην C# ποια Models να γίνουν Πίνακες στη Βάση (DbSets)
        public DbSet<Category> Categories { get; set; }
        public DbSet<TrafficSign> TrafficSigns { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Questions> Questions { get; set; }
        public DbSet<UserResults> UserResults { get; set; }
    }
}