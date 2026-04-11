<<<<<<< HEAD
﻿using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HibaVonal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // JWT token az autentikációhoz
    public class IssueController : ControllerBase
=======
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/[controller]")]
    public class IssueController : AuthorizedControllerBase
>>>>>>> Maintainer+LeadMaintainer+Seeds
    {
        private readonly IIssueService _issueService;

        public IssueController(IIssueService issueService)
        {
            _issueService = issueService;
        }

<<<<<<< HEAD
        // JWT tokenből kiolvassuk a bejelentkezett felhasználó Id-ját
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim!);
        }

        // GET api/issue/my  // Csak a bejelentkezett felhasználó által jelentett hibákat adja vissza
=======
>>>>>>> Maintainer+LeadMaintainer+Seeds
        [HttpGet("my")]
        public async Task<IActionResult> GetMyIssues()
        {
            var reporterId = GetCurrentUserId();
            var issues = await _issueService.GetMyIssuesAsync(reporterId);
            return Ok(issues);
        }

<<<<<<< HEAD
        // POST api/issue // Új hiba létrehozása a bejelentkezett felhasználó által
=======
>>>>>>> Maintainer+LeadMaintainer+Seeds
        [HttpPost]
        public async Task<IActionResult> CreateIssue([FromBody] CreateIssueRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _issueService.CreateIssueAsync(request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, issue = result.Issue });
        }

<<<<<<< HEAD
        // PUT api/issue/{id} // Hiba frissítése a bejelentkezett felhasználó által (csak az általa jelentett hibákat frissítheti)
=======
>>>>>>> Maintainer+LeadMaintainer+Seeds
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
<<<<<<< HEAD
}
=======
}
>>>>>>> Maintainer+LeadMaintainer+Seeds
