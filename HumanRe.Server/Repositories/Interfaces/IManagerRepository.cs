using HumanRe.Server.Models;

namespace HumanRe.Server.Repositories.Interfaces
{
    public interface IManagerRepository
    {
        Task ActionLeaveRequestAsync(LeaveRequest request);
        Task<IEnumerable<LeaveRequest>> ViewManagerLeaveRequestsAsync(int managerId);
    }
}
