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

    [HttpPost("addleaverequest")]
    public async Task<IActionResult> AddLeaveRequest([FromBody] AddLeaveRequestObject requestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var leaveRequest = new LeaveRequest
        {
            EmployeeId = requestDto.EmployeeId,
            StartDate = requestDto.StartDate,
            EndDate = requestDto.EndDate,
            NumberOfDays = requestDto.NumberOfDays,
            Reason = requestDto.Reason,
            IsApproved = requestDto.IsApproved,
            IsRejected = requestDto.IsRejected,
            IsWithdrawn = requestDto.IsWithdrawn,
            CreatedDate = requestDto.CreatedDate,
            ModifiedDate = requestDto.ModifiedDate,
            ApprovedById = requestDto.ApprovedById,
            ApprovalDate = requestDto.ApprovalDate,
            RejectionReason = requestDto.RejectionReason
        };

        await _employeeRepository.AddLeaveRequestAsync(leaveRequest);

        return CreatedAtAction(nameof(ViewLeaveRequests), new { id = leaveRequest.Id }, leaveRequest);
    }


    [HttpPut("leave-requests")]
    public async Task<IActionResult> UpdateLeaveRequest([FromBody] LeaveRequest leaveRequest)
    {
        await _employeeRepository.UpdateLeaveRequestAsync(leaveRequest);
        return NoContent();
    }

    [HttpPost("leave-requests/{id}")]
    public async Task<IActionResult> RetractLeaveRequest(string id)
    {
        await _employeeRepository.RetractLeaveRequestAsync(id);
        return NoContent();
    }
}
