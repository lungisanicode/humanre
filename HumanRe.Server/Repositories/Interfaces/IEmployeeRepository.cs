using HumanRe.Server.Models;

namespace HumanRe.Server.Repositories.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<LeaveRequest>> ViewLeaveRequestsAsync();
        Task AddLeaveRequestAsync(LeaveRequest leaveRequest);
        Task RetractLeaveRequestAsync(string leaveId);
        Task UpdateLeaveRequestAsync(LeaveRequest leaveRequest);
       
    }
}
