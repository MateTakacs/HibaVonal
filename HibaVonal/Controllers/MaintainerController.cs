using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/maintainer")]
    [Authorize(Roles = nameof(UserRole.Maintainer))]
    public class MaintainerController : AuthorizedControllerBase
    {
        private readonly IMaintainerService _maintainerService;

        public MaintainerController(IMaintainerService maintainerService)
        {
            _maintainerService = maintainerService;
        }

        [HttpGet("issues")]
        public async Task<IActionResult> GetAssignedIssues([FromQuery] StatusEnum? status)
        {
            var maintainerId = GetCurrentUserId();
            var issues = await _maintainerService.GetAssignedIssuesAsync(maintainerId, status);
            return Ok(issues);
        }

        [HttpGet("issues/{id:int}")]
        public async Task<IActionResult> GetAssignedIssueById(int id)
        {
            var maintainerId = GetCurrentUserId();
            var result = await _maintainerService.GetAssignedIssueByIdAsync(id, maintainerId);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.Issue);
        }

        [HttpPatch("issues/{id:int}/status")]
        public async Task<IActionResult> UpdateAssignedIssueStatus(int id, [FromBody] ChangeIssueStatusRequest request)
        {
            var maintainerId = GetCurrentUserId();
            var result = await _maintainerService.UpdateAssignedIssueStatusAsync(id, request.Status, maintainerId);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, issue = result.Issue });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] OrderStatus? status)
        {
            var orders = await _maintainerService.GetOrdersAsync(status);
            return Ok(orders);
        }

        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrderRequest([FromBody] CreateOrderRequest request)
        {
            var maintainerId = GetCurrentUserId();
            var result = await _maintainerService.CreateOrderRequestAsync(request, maintainerId);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, order = result.Order });
        }
    }
}
