using HumanRe.Server.Middleware;
using HumanRe.Server.Models;
using HumanRe.Server.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HumanRe.Server.Repositories.Implementations
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly ILogger<ManagerRepository> _logger;
        private readonly HumanResourceContext _context;

        public ManagerRepository(ILogger<ManagerRepository> logger, HumanResourceContext context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task ActionLeaveRequestAsync(LeaveRequest request)
        {
            try
            {
                var existingRequest = await _context.LeaveRequests
                    .FirstOrDefaultAsync(lr => lr.Id == request.Id);

                if (existingRequest == null)
                {
                    _logger.LogWarning("Leave request {LeaveRequestId} not found", request.Id);
                    throw new KeyNotFoundException("Leave request not found");
                }

                if (request.IsApproved)
                {
                    existingRequest.IsApproved = true;
                    existingRequest.IsRejected = false;
                    existingRequest.ApprovedById = request.ApprovedById;
                    existingRequest.ApprovalDate = DateTime.UtcNow;
                    existingRequest.RejectionReason = string.Empty;
                }
                else if (request.IsRejected)
                {
                    existingRequest.IsRejected = true;
                    existingRequest.IsApproved = false;
                    existingRequest.RejectionReason = request.RejectionReason;
                    existingRequest.ApprovedById = request.ApprovedById;
                    existingRequest.ApprovalDate = DateTime.UtcNow;
                }
                else if (request.IsWithdrawn)
                {
                    existingRequest.IsWithdrawn = true;
                }

                existingRequest.ModifiedDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Leave request {LeaveRequestId} updated successfully", request.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating leave request {LeaveRequestId}", request.Id);
                throw;
            }
        }

        public async Task<IEnumerable<LeaveRequest>> ViewManagerLeaveRequestsAsync(int managerId)
        {
            try
            {
                var requests = await _context.LeaveRequests
                    .Include(lr => lr.Employee)
                    .Include(lr => lr.LeaveType)
                    .Include(lr => lr.ApprovedBy)
                    .Where(lr => lr.ApprovedById == managerId || (!lr.IsApproved && !lr.IsRejected))
                    .OrderByDescending(lr => lr.CreatedDate)
                    .ToListAsync();

                return requests;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving leave requests for manager {ManagerId}", managerId);
                throw;
            }
        }
    }
}
