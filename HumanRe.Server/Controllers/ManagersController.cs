using HumanRe.Server.Models;
using HumanRe.Server.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ManagersController : ControllerBase
{
    private readonly IManagerRepository _managerRepository;

    public ManagersController(IManagerRepository managerRepository)
    {
        _managerRepository = managerRepository;
    }

    [HttpGet("{managerId}/leave-requests")]
    public async Task<IActionResult> ViewLeaveRequests(int managerId)
    {
        var requests = await _managerRepository.ViewManagerLeaveRequestsAsync(managerId);
        return Ok(requests);
    }

    [HttpPost("leave-requests/action")]
    public async Task<IActionResult> ActionLeaveRequest([FromBody] LeaveRequest leaveRequest)
    {
        await _managerRepository.ActionLeaveRequestAsync(leaveRequest);
        return NoContent();
    }
}
