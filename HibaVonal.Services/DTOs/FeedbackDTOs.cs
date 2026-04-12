namespace HibaVonal.Services.DTOs
{
    public record CreateFeedbackRequest(
        int IssueId,
        string Comment
    );

    public record FeedbackResponse(
        int Id,
        string Comment,
        DateTime CreatedAt,
        int IssueId
    );
}