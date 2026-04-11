using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/lead-maintainer")]
    [Authorize(Roles = nameof(UserRole.Lead_Maintainer))]
    public class LeadMaintainerController : AuthorizedControllerBase
    {
        private readonly ILeadMaintainerService _leadMaintainerService;

        public LeadMaintainerController(ILeadMaintainerService leadMaintainerService)
        {
            _leadMaintainerService = leadMaintainerService;
        }

        [HttpGet("issues")]
        public async Task<IActionResult> GetIssues([FromQuery] StatusEnum? status, [FromQuery] bool onlyUnassigned = false)
        {
            var issues = await _leadMaintainerService.GetAllIssuesAsync(status, onlyUnassigned);
            return Ok(issues);
        }

        [HttpGet("issues/{id:int}")]
        public async Task<IActionResult> GetIssueById(int id)
        {
            var result = await _leadMaintainerService.GetIssueByIdAsync(id);

            if (!result.Success)
            {
                return NotFound(new { message = result.Message });
            }

            return Ok(result.Issue);
        }

        [HttpGet("maintainers")]
        public async Task<IActionResult> GetMaintainers()
        {
            var maintainers = await _leadMaintainerService.GetMaintainersAsync();
            return Ok(maintainers);
        }

        [HttpPatch("issues/{id:int}/assign")]
        public async Task<IActionResult> AssignIssue(int id, [FromBody] AssignIssueRequest request)
        {
            var result = await _leadMaintainerService.AssignIssueAsync(id, request.MaintainerId);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, issue = result.Issue });
        }

        [HttpPatch("issues/{id:int}/status")]
        public async Task<IActionResult> UpdateIssueStatus(int id, [FromBody] ChangeIssueStatusRequest request)
        {
            var result = await _leadMaintainerService.UpdateIssueStatusAsync(id, request.Status);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, issue = result.Issue });
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders([FromQuery] OrderStatus? status)
        {
            var orders = await _leadMaintainerService.GetOrdersAsync(status);
            return Ok(orders);
        }

        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var result = await _leadMaintainerService.CreateOrderAsync(request);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, order = result.Order });
        }

        [HttpPatch("orders/{id:int}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] ChangeOrderStatusRequest request)
        {
            var result = await _leadMaintainerService.UpdateOrderStatusAsync(id, request.Status);

            if (!result.Success)
            {
                return BadRequest(new { message = result.Message });
            }

            return Ok(new { message = result.Message, order = result.Order });
        }
    }
}
