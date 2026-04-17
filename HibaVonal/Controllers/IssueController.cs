using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/collegiate")]
    [Authorize(Roles = nameof(UserRole.User))]
    public class IssueController : AuthorizedControllerBase
    {
        private readonly IIssueService _issueService;

        public IssueController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        // GET api/collegiate/issues
        [HttpGet("issues")]
        public async Task<IActionResult> GetMyIssues()
        {
            var reporterId = GetCurrentUserId();
            var issues = await _issueService.GetMyIssuesAsync(reporterId);
            return Ok(issues);
        }

        // POST api/collegiate/issue
        [HttpPost("issue")]
        public async Task<IActionResult> CreateIssue([FromBody] CreateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.CreateIssueAsync(request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, issue = result.Issue });
        }

        // PUT api/collegiate/issue/{id}
        [HttpPut("issue/{id}")]
        public async Task<IActionResult> UpdateIssue(int id, [FromBody] UpdateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.UpdateIssueAsync(id, request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        // GET api/collegiate/rooms/{roomNum}/equipments
        [HttpGet("rooms/{roomNum}/equipments")]
        public async Task<IActionResult> GetEquipmentsByRoom(int roomNum)
        {
            var equipments = await _issueService.GetEquipmentsByRoomNumAsync(roomNum);
            return Ok(equipments);
        }
    }
}