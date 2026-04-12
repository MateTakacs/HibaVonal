using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        // GET api/issue/my  // Csak a bejelentkezett felhasználó által jelentett hibákat adja vissza
        [HttpGet("issues")]
        public async Task<IActionResult> GetMyIssues()
        {
            var reporterId = GetCurrentUserId();
            var issues = await _issueService.GetMyIssuesAsync(reporterId);
            return Ok(issues);
        }

        // POST api/issue // Új hiba létrehozása a bejelentkezett felhasználó által
        [HttpPost("issue")]
        public async Task<IActionResult> CreateIssue([FromBody] CreateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.CreateIssueAsync(request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, issue = result.Issue });
        }


        // PUT api/issue/{id} // Hiba frissítése a bejelentkezett felhasználó által (csak az általa jelentett hibákat frissítheti)
        [HttpPut("issue/{id}")]
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


