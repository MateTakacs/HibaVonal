using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal.Services.Implementations
{
    public class FeedbackService : IFeedbackService
    {
        private readonly HibaVonalDBContext _context;

        public FeedbackService(HibaVonalDBContext context)
        {
            _context = context;
        }

        // Kollégista: visszajelzés küldése
        public async Task<(bool Success, string Message, FeedbackResponse? Feedback)> CreateFeedbackAsync(CreateFeedbackRequest request, int reporterId)
        {
            var issue = await _context.Issues
                .FirstOrDefaultAsync(i => i.Id == request.IssueId);

            if (issue == null)
                return (false, "A hibabejelentés nem található.", null);

            // a kollégista saját hibájához küld-e visszajelzést
            if (issue.ReporterId != reporterId)
                return (false, "Csak a saját hibabejelentésedhez küldhetsz visszajelzést.", null);

            // csak Resolved státuszú hibához lehet visszajelzést küldeni
            if (issue.Status != StatusEnum.Resolved)
                return (false, "Csak javított státuszú hibabejelentéshez küldhetsz visszajelzést.", null);

            var feedback = new Feedback
            {
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow,
                IssueId = request.IssueId,
                ReporterId = reporterId
            };

            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            var response = MapToResponse(feedback);
            return (true, "Visszajelzés sikeresen elküldve!", response);
        }

        // Kollégista: saját visszajelzések lekérdezése
        public async Task<List<FeedbackResponse>> GetMyFeedbacksAsync(int reporterId)
        {
            var feedbacks = await _context.Feedbacks
                .Where(f => f.ReporterId == reporterId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return feedbacks.Select(MapToResponse).ToList();
        }

        private static FeedbackResponse MapToResponse(Feedback feedback)
        {
            return new FeedbackResponse(
                feedback.Id,
                feedback.Comment,
                feedback.CreatedAt,
                feedback.IssueId
            );
        }
    }
}