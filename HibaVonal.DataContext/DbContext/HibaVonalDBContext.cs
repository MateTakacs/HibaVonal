using HibaVonal_backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal_backend
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasOne(u => u.Room)
                .WithMany(r => r.Tenants)
                .HasForeignKey(u => u.RoomNum)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Issue>()
                .HasOne(i => i.AssignedMaintainer)
                .WithMany(u => u.AssignedIssues)
                .HasForeignKey(i => i.AssignedMaintainerId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Issue>()
                .HasOne(i => i.Room)
                .WithMany(r => r.Issues)
                .HasForeignKey(i => i.RoomNum)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);


            modelBuilder.Entity<RoomEquip>()
                .HasOne(re => re.Room)
                .WithMany(r => r.RoomEquips)
                .HasForeignKey(re => re.RoomId);


            modelBuilder.Entity<RoomEquip>()
                .HasOne(re => re.Equipment)
                .WithMany()
                .HasForeignKey(re => re.EquipId);


            modelBuilder.Entity<ToolUser>()
                .HasOne(tu => tu.Tool)
                .WithMany()
                .HasForeignKey(tu => tu.ToolId);

            modelBuilder.Entity<ToolUser>()
                .HasOne(tu => tu.User)
                .WithMany(u => u.ToolUsers)
                .HasForeignKey(tu => tu.UserId);

            modelBuilder.Entity<User>().Property(u => u.Role).HasConversion<byte>();
            modelBuilder.Entity<Room>().Property(r => r.Type).HasConversion<byte>();
            modelBuilder.Entity<Issue>().Property(i => i.Status).HasConversion<byte>();
            modelBuilder.Entity<Issue>().Property(i => i.Urgency).HasConversion<byte>();
            modelBuilder.Entity<Order>().Property(o => o.Status).HasConversion<byte>();
        }
    }
}
