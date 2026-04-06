using HibaVonal.DataContext.Entities;

namespace HibaVonal.Services.DTOs
{
    public record IssueManagementResponse(
        int Id,
        string Description,
        string Status,
        string Urgency,
        DateTime ReportDate,
        int? RoomId,
        int? RoomNumber,
        int? EquipmentId,
        string? EquipmentName,
        int? ReporterId,
        string? ReporterName,
        string? ReporterEmail,
        int? AssignedMaintainerId,
        string? AssignedMaintainerName,
        string? AssignedMaintainerEmail
    );

    public record AssignIssueRequest(int MaintainerId);

    public record ChangeIssueStatusRequest(StatusEnum Status);

    public record CreateOrderRequest(
        int ToolListId,
        DateTime DeliveryDate
    );

    public record ChangeOrderStatusRequest(OrderStatus Status);

    public record OrderResponse(
        int Id,
        DateTime OrderDate,
        DateTime DeliveryDate,
        string Status,
        int ToolListId,
        string ToolMaker,
        string ToolModel,
        int ToolPrice
    );

    public record MaintainerLookupResponse(
        int Id,
        string Username,
        string Name,
        string Email
    );
}
