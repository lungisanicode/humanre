using HumanRe.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace HumanRe.Server.Middleware
{
    public class HumanResourceContext : DbContext
    {
        public HumanResourceContext(DbContextOptions<HumanResourceContext> options) : base(options) { }

        public DbSet<Team> Teams { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }
        public DbSet<PublicHoliday> PublicHolidays { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.Employee)
                .WithMany(e => e.LeaveRequests)
                .HasForeignKey(lr => lr.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LeaveRequest>()
                .HasOne(lr => lr.ApprovedBy)
                .WithMany()
                .HasForeignKey(lr => lr.ApprovedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
