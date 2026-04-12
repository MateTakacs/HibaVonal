using HibaVonal.Services.DTOs;

namespace HibaVonal.Services.Interfaces
{
    public interface IFeedbackService
    {
        // Kollégista: visszajelzés küldése
        Task<(bool Success, string Message, FeedbackResponse? Feedback)> CreateFeedbackAsync(CreateFeedbackRequest request, int reporterId);

        // Kollégista: saját visszajelzések lekérdezése
        Task<List<FeedbackResponse>> GetMyFeedbacksAsync(int reporterId);
    }
}