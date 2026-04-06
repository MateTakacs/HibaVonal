using Microsoft.EntityFrameworkCore;

namespace HibaVonal.DataContext.DB
{
    public class HibaVonalDBContext : DbContext
    {
        public HibaVonalDBContext(DbContextOptions<HibaVonalDBContext> options) : base(options)
        {
        }
        public DbSet<Entities.Order> Orders { get; set; } = null!;
        public DbSet<Entities.Tool> Tools { get; set; } = null!;
        public DbSet<Entities.ToolList> ToolLists { get; set; } = null!;
        public DbSet<Entities.ToolUser> ToolUsers { get; set; } = null!;
        public DbSet<Entities.User> Users { get; set; } = null!;
        public DbSet<Entities.Issue> Issues { get; set; } = null!;
        public DbSet<Entities.Room> Rooms { get; set; } = null!;
        public DbSet<Entities.Equipment> Equipments { get; set; } = null!;
        public DbSet<Entities.RoomEquip> RoomEquips{ get; set; } = null!;
        public DbSet<Entities.RegAllow> RegAllows { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Entities.User>()
                .HasOne(u => u.Room)
                .WithMany(r => r.Tenants)
                .HasForeignKey(u => u.RoomNum)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Entities.Issue>()
                .HasOne(i => i.AssignedMaintainer)
                .WithMany(u => u.AssignedIssues)
                .HasForeignKey(i => i.AssignedMaintainerId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Entities.Issue>()
                .HasOne(i => i.Room)
                .WithMany(r => r.Issues)
                .HasForeignKey(i => i.RoomNum)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<Entities.RoomEquip>()
                .HasOne(re => re.Room)
                .WithMany(r => r.RoomEquips)
                .HasForeignKey(re => re.RoomId);


            modelBuilder.Entity<Entities.RoomEquip>()
                .HasOne(re => re.Equipment)
                .WithMany()
                .HasForeignKey(re => re.EquipId);


            modelBuilder.Entity<Entities.ToolUser>()
                .HasOne(tu => tu.Tool)
                .WithMany()
                .HasForeignKey(tu => tu.ToolId);

            modelBuilder.Entity<Entities.ToolUser>()
                .HasOne(tu => tu.User)
                .WithMany(u => u.ToolUsers)
                .HasForeignKey(tu => tu.UserId);

            modelBuilder.Entity<Entities.Issue>()
                .HasOne(i => i.Reporter)
                .WithMany(u => u.ReportedIssues)
                .HasForeignKey(i => i.ReporterId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Entities.User>().Property(u => u.Role).HasConversion<byte>();
            modelBuilder.Entity<Entities.Room>().Property(r => r.Type).HasConversion<byte>();
            modelBuilder.Entity<Entities.Issue>().Property(i => i.Status).HasConversion<byte>();
            modelBuilder.Entity<Entities.Issue>().Property(i => i.Urgency).HasConversion<byte>();
            modelBuilder.Entity<Entities.Order>().Property(o => o.Status).HasConversion<byte>();
        }
    }
}
