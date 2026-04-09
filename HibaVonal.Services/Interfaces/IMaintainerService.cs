using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;

namespace HibaVonal.Services.Interfaces
{
    public interface IMaintainerService
    {
        Task<List<IssueManagementResponse>> GetAssignedIssuesAsync(int maintainerId, StatusEnum? status = null);
        Task<(bool Success, string Message, IssueManagementResponse? Issue)> GetAssignedIssueByIdAsync(int issueId, int maintainerId);
        Task<(bool Success, string Message, IssueManagementResponse? Issue)> UpdateAssignedIssueStatusAsync(int issueId, StatusEnum status, int maintainerId);
        Task<List<OrderResponse>> GetOrdersAsync(OrderStatus? status = null);
        Task<(bool Success, string Message, OrderResponse? Order)> CreateOrderRequestAsync(CreateOrderRequest request, int maintainerId);
    }
}
