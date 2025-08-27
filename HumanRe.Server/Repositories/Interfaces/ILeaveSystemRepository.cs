using HumanRe.Server.Models;

namespace HumanRe.Server.Repositories.Interfaces
{
    public interface ILeaveSystemRepository
    {
        Task<Employee?> LogIntoSystemAsync(string email);
    }
}
