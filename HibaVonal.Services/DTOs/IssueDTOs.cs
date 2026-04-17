using HibaVonal.DataContext.Entities;

namespace HibaVonal.Services.DTOs
{
    public record CreateIssueRequest(
        string Description,
        UrgencyEnum Urgency,
        int RoomNum,
        int? EquipmentId
    );

    public record UpdateIssueRequest(
        string Description,
        UrgencyEnum Urgency
    );

    public record IssueResponse(
        int Id,
        string Description,
        string Status,
        string Urgency,
        DateTime ReportDate,
        int? RoomNum,
        int? EquipmentId
    );

    public record EquipmentResponse(
        int Id,
        string Name
    );
}