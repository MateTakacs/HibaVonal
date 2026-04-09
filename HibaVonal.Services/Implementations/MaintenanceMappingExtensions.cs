using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;

namespace HibaVonal.Services.Implementations
{
    internal static class MaintenanceMappingExtensions
    {
        public static IssueManagementResponse ToManagementResponse(this Issue issue)
        {
            return new IssueManagementResponse(
                issue.Id,
                issue.Description,
                issue.Status.ToString(),
                issue.Urgency.ToString(),
                issue.ReportDate,
                issue.Room?.Id,
                issue.Room?.RoomNum,
                issue.EquipmentId,
                issue.Equipment?.EquipName,
                issue.ReporterId,
                issue.Reporter?.Name,
                issue.Reporter?.Email,
                issue.AssignedMaintainerId,
                issue.AssignedMaintainer?.Name,
                issue.AssignedMaintainer?.Email
            );
        }

        public static OrderResponse ToOrderResponse(this Order order)
        {
            return new OrderResponse(
                order.Id,
                order.OrderDate,
                order.DeliveryDate,
                order.Status.ToString(),
                order.ToolListId,
                order.ToolList.ToolMaker,
                order.ToolList.ToolModel,
                order.ToolList.ToolPrice
            );
        }
    }
}
