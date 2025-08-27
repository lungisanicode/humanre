using HumanRe.Server.Middleware;
using HumanRe.Server.Models;
using HumanRe.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HumanRe.Server.Repositories.Implementations
{
    public class LeaveSystemRepository : ILeaveSystemRepository
    {
        private readonly ILogger<LeaveSystemRepository> _logger;
        private readonly HumanResourceContext _resourceContext;

        public LeaveSystemRepository(ILogger<LeaveSystemRepository> logger, HumanResourceContext context)
        {
            _logger = logger;
            _resourceContext = context;
        }

        public async Task<Employee?> LogIntoSystemAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            try
            {
                var employee = await _resourceContext.Employees
                    .FirstOrDefaultAsync(e => e.EmailAddress == email);

                if (employee == null)
                {
                    _logger.LogWarning("Login attempt failed. No employee found with email: {Email}", email);
                    return null;
                }

                _logger.LogInformation("Employee {EmployeeId} logged in successfully", employee.Id);
                return employee;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in employee with email {Email}", email);
                throw;
            }
        }

    }
}
