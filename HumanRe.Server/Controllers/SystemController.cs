using HumanRe.Server.Repositories.Interfaces;
using HumanRe.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace HumanRe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly ILeaveSystemRepository _leaverepository;
        public SystemController(ILeaveSystemRepository leaveRepository)
        {
            _leaverepository = leaveRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogIntoSystem([FromBody] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required");
            }

            var employee = await _leaverepository.LogIntoSystemAsync(email);
            if (employee == null)
                return Unauthorized("Employee not found");

            return Ok(employee);
        }
    }
}
