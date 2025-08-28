using HumanRe.Server.Middleware;
using HumanRe.Server.Models;
using HumanRe.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly ILogger<EmployeeRepository> _logger;
    private readonly HumanResourceContext _resourceContext;

    public EmployeeRepository(ILogger<EmployeeRepository> logger, HumanResourceContext resourceContext)
    {
        _logger = logger;
        _resourceContext = resourceContext;
    }

    public async Task AddLeaveRequestAsync(LeaveRequest leaveRequest)
    {
        try
        {
            leaveRequest.CreatedDate = DateTime.UtcNow;
            leaveRequest.ModifiedDate = DateTime.UtcNow;
            leaveRequest.IsApproved = false;
            leaveRequest.IsRejected = false;
            leaveRequest.IsWithdrawn = false;

            await _resourceContext.LeaveRequests.AddAsync(leaveRequest);
            await _resourceContext.SaveChangesAsync();

            _logger.LogInformation("Leave request {LeaveRequestId} created successfully", leaveRequest.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating leave request for employee {EmployeeId}", leaveRequest.EmployeeId);
            throw;
        }
    }

    public async Task RetractLeaveRequestAsync(string leaveId)
    {
        try
        {
            if (!int.TryParse(leaveId, out int id))
                throw new ArgumentException("Invalid leave request ID");

            var leaveRequest = await _resourceContext.LeaveRequests.FirstOrDefaultAsync(lr => lr.Id == id);

            if (leaveRequest == null)
                throw new KeyNotFoundException("Leave request not found");

            leaveRequest.IsWithdrawn = true;
            leaveRequest.ModifiedDate = DateTime.UtcNow;

            await _resourceContext.SaveChangesAsync();
            _logger.LogInformation("Leave request {LeaveRequestId} withdrawn successfully", leaveRequest.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error withdrawing leave request {LeaveRequestId}", leaveId);
            throw;
        }
    }

    public async Task UpdateLeaveRequestAsync(LeaveRequest leaveRequest)
    {
        try
        {
            var existingRequest = await _resourceContext.LeaveRequests.FirstOrDefaultAsync(lr => lr.Id == leaveRequest.Id);

            if (existingRequest == null)
                throw new KeyNotFoundException("Leave request not found");

            if (existingRequest.IsApproved || existingRequest.IsRejected || existingRequest.IsWithdrawn)
            {
                throw new InvalidOperationException("Cannot update a processed leave request");
            }

            existingRequest.StartDate = leaveRequest.StartDate;
            existingRequest.EndDate = leaveRequest.EndDate;
            existingRequest.NumberOfDays = leaveRequest.NumberOfDays;
            existingRequest.Reason = leaveRequest.Reason;
            existingRequest.ModifiedDate = DateTime.UtcNow;

            await _resourceContext.SaveChangesAsync();
            _logger.LogInformation("Leave request {LeaveRequestId} updated successfully", existingRequest.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating leave request {LeaveRequestId}", leaveRequest.Id);
            throw;
        }
    }

    public async Task<IEnumerable<LeaveRequest>> ViewLeaveRequestsAsync()
    {
        try
        {
            var requests = await _resourceContext.LeaveRequests
                .Include(lr => lr.ApprovedBy)
                .Include(lr => lr.Employee)
                .OrderByDescending(lr => lr.CreatedDate)
                .ToListAsync();

            return requests;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving leave requests");
            throw;
        }
    }
}
