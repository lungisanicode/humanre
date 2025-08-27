using HumanRe.Server.Models;
using HumanRe.Server.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeRepository _employeeRepository;

    public EmployeesController(IEmployeeRepository employeeRepository)
    {
        _employeeRepository = employeeRepository;
    }

    [HttpGet("leave-requests")]
    public async Task<IActionResult> ViewLeaveRequests()
    {
        var requests = await _employeeRepository.ViewLeaveRequestsAsync();
        return Ok(requests);
    }

    [HttpPost("leave-requests")]
    public async Task<IActionResult> AddLeaveRequest([FromBody] LeaveRequest leaveRequest)
    {
        await _employeeRepository.AddLeaveRequestAsync(leaveRequest);
        return CreatedAtAction(nameof(ViewLeaveRequests), new { id = leaveRequest.Id }, leaveRequest);
    }

    [HttpPut("leave-requests")]
    public async Task<IActionResult> UpdateLeaveRequest([FromBody] LeaveRequest leaveRequest)
    {
        await _employeeRepository.UpdateLeaveRequestAsync(leaveRequest);
        return NoContent();
    }

    [HttpDelete("leave-requests/{id}")]
    public async Task<IActionResult> RetractLeaveRequest(string id)
    {
        await _employeeRepository.RetractLeaveRequestAsync(id);
        return NoContent();
    }
}
