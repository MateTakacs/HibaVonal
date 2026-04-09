using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;

namespace HibaVonal.Services.Interfaces
{
    public interface ILeadMaintainerService
    {
        Task<List<IssueManagementResponse>> GetAllIssuesAsync(StatusEnum? status = null, bool onlyUnassigned = false);
        Task<(bool Success, string Message, IssueManagementResponse? Issue)> GetIssueByIdAsync(int issueId);
        Task<List<MaintainerLookupResponse>> GetMaintainersAsync();
        Task<(bool Success, string Message, IssueManagementResponse? Issue)> AssignIssueAsync(int issueId, int maintainerId);
        Task<(bool Success, string Message, IssueManagementResponse? Issue)> UpdateIssueStatusAsync(int issueId, StatusEnum status);
        Task<List<OrderResponse>> GetOrdersAsync(OrderStatus? status = null);
        Task<(bool Success, string Message, OrderResponse? Order)> CreateOrderAsync(CreateOrderRequest request);
        Task<(bool Success, string Message, OrderResponse? Order)> UpdateOrderStatusAsync(int orderId, OrderStatus status);
    }
}
