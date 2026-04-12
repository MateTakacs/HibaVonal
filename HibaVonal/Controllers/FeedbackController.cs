using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HibaVonal.Controllers
{
    [Route("api/collegiate")]
    [Authorize(Roles = nameof(UserRole.User))]
    public class FeedbackController : AuthorizedControllerBase
    {
        private readonly IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // GET api/collegiate/feedbacks
        [HttpGet("feedbacks")]
        public async Task<IActionResult> GetMyFeedbacks()
        {
            var reporterId = GetCurrentUserId();
            var feedbacks = await _feedbackService.GetMyFeedbacksAsync(reporterId);
            return Ok(feedbacks);
        }

        // POST api/collegiate/feedback
        [HttpPost("feedback")]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackRequest request)
        {
            var reporterId = GetCurrentUserId();
            var result = await _feedbackService.CreateFeedbackAsync(request, reporterId);

            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message, feedback = result.Feedback });
        }
    }
}