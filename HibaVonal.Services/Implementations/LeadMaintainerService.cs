using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal.Services.Implementations
{
    public class LeadMaintainerService : ILeadMaintainerService
    {
        private readonly HibaVonalDBContext _context;

        public LeadMaintainerService(HibaVonalDBContext context)
        {
            _context = context;
        }

        public async Task<List<IssueManagementResponse>> GetAllIssuesAsync(StatusEnum? status = null, bool onlyUnassigned = false)
        {
            var query = BuildIssuesQuery();

            if (status.HasValue)
            {
                query = query.Where(i => i.Status == status.Value);
            }

            if (onlyUnassigned)
            {
                query = query.Where(i => i.AssignedMaintainerId == null);
            }

            var issues = await query
                .OrderByDescending(i => i.ReportDate)
                .ToListAsync();

            return issues.Select(i => i.ToManagementResponse()).ToList();
        }

        public async Task<(bool Success, string Message, IssueManagementResponse? Issue)> GetIssueByIdAsync(int issueId)
        {
            var issue = await BuildIssuesQuery()
                .FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue is null)
            {
                return (false, "A hibajegy nem található.", null);
            }

            return (true, "A hibajegy sikeresen lekérdezve.", issue.ToManagementResponse());
        }

        public async Task<List<MaintainerLookupResponse>> GetMaintainersAsync()
        {
            return await _context.Users
                .AsNoTracking()
                .Where(u => u.Role == UserRole.Maintainer)
                .OrderBy(u => u.Name)
                .Select(u => new MaintainerLookupResponse(u.Id, u.Username, u.Name, u.Email))
                .ToListAsync();
        }

        public async Task<(bool Success, string Message, IssueManagementResponse? Issue)> AssignIssueAsync(int issueId, int maintainerId)
        {
            var issue = await _context.Issues
                .Include(i => i.Room)
                .Include(i => i.Equipment)
                .Include(i => i.Reporter)
                .Include(i => i.AssignedMaintainer)
                .FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue is null)
            {
                return (false, "A hibajegy nem található.", null);
            }

            if (issue.Status == StatusEnum.Closed)
            {
                return (false, "Lezárt hibajegy nem rendelhető hozzá új karbantartóhoz.", null);
            }

            var maintainer = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == maintainerId && u.Role == UserRole.Maintainer);

            if (maintainer is null)
            {
                return (false, "A megadott felhasználó nem karbantartó, vagy nem található.", null);
            }

            issue.AssignedMaintainerId = maintainerId;
            issue.AssignedMaintainer = maintainer;
            await _context.SaveChangesAsync();

            return (true, "A hibajegy sikeresen hozzárendelve a karbantartóhoz.", issue.ToManagementResponse());
        }

        public async Task<(bool Success, string Message, IssueManagementResponse? Issue)> UpdateIssueStatusAsync(int issueId, StatusEnum status)
        {
            var issue = await _context.Issues
                .Include(i => i.Room)
                .Include(i => i.Equipment)
                .Include(i => i.Reporter)
                .Include(i => i.AssignedMaintainer)
                .FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue is null)
            {
                return (false, "A hibajegy nem található.", null);
            }

            issue.Status = status;
            await _context.SaveChangesAsync();

            return (true, "A hibajegy állapota sikeresen frissítve.", issue.ToManagementResponse());
        }

        public async Task<List<OrderResponse>> GetOrdersAsync(OrderStatus? status = null)
        {
            var query = _context.Orders
                .AsNoTracking()
                .Include(o => o.ToolList)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            var orders = await query
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(o => o.ToOrderResponse()).ToList();
        }

        public async Task<(bool Success, string Message, OrderResponse? Order)> CreateOrderAsync(CreateOrderRequest request)
        {
            var toolList = await _context.ToolLists
                .FirstOrDefaultAsync(t => t.Id == request.ToolListId);

            if (toolList is null)
            {
                return (false, "A megadott eszközlista elem nem található.", null);
            }

            if (request.DeliveryDate <= DateTime.UtcNow)
            {
                return (false, "A szállítási dátumnak jövőbelinek kell lennie.", null);
            }

            var order = new Order
            {
                ToolListId = request.ToolListId,
                OrderDate = DateTime.UtcNow,
                DeliveryDate = request.DeliveryDate,
                Status = OrderStatus.Pending
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            order.ToolList = toolList;
            return (true, "Az eszközrendelés sikeresen létrehozva.", order.ToOrderResponse());
        }

        public async Task<(bool Success, string Message, OrderResponse? Order)> UpdateOrderStatusAsync(int orderId, OrderStatus status)
        {
            var order = await _context.Orders
                .Include(o => o.ToolList)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order is null)
            {
                return (false, "A rendelés nem található.", null);
            }

            order.Status = status;
            await _context.SaveChangesAsync();

            return (true, "A rendelés állapota sikeresen frissítve.", order.ToOrderResponse());
        }

        private IQueryable<Issue> BuildIssuesQuery()
        {
            return _context.Issues
                .AsNoTracking()
                .Include(i => i.Room)
                .Include(i => i.Equipment)
                .Include(i => i.Reporter)
                .Include(i => i.AssignedMaintainer);
        }
    }
}
