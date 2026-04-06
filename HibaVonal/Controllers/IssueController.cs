using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/[controller]")]
    public class IssueController : AuthorizedControllerBase
    {
        private readonly IIssueService _issueService;

        public IssueController(IIssueService issueService)
        {
            _issueService = issueService;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyIssues()
        {
            var reporterId = GetCurrentUserId();
            var issues = await _issueService.GetMyIssuesAsync(reporterId);
            return Ok(issues);
        }

        [HttpPost]
        public async Task<IActionResult> CreateIssue([FromBody] CreateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.CreateIssueAsync(request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, issue = result.Issue });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateIssue(int id, [FromBody] UpdateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.UpdateIssueAsync(id, request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }
    }
}
