using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal.Services.Implementations
{
    public class MaintainerService : IMaintainerService
    {
        private readonly HibaVonalDBContext _context;

        public MaintainerService(HibaVonalDBContext context)
        {
            _context = context;
        }

        public async Task<List<IssueManagementResponse>> GetAssignedIssuesAsync(int maintainerId, StatusEnum? status = null)
        {
            var query = BuildAssignedIssuesQuery(maintainerId);

            if (status.HasValue)
            {
                query = query.Where(i => i.Status == status.Value);
            }

            var issues = await query
                .OrderByDescending(i => i.ReportDate)
                .ToListAsync();

            return issues.Select(i => i.ToManagementResponse()).ToList();
        }

        public async Task<(bool Success, string Message, IssueManagementResponse? Issue)> GetAssignedIssueByIdAsync(int issueId, int maintainerId)
        {
            var issue = await BuildAssignedIssuesQuery(maintainerId)
                .FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue is null)
            {
                return (false, "A hibajegy nem található, vagy nincs hozzád rendelve.", null);
            }

            return (true, "A hibajegy sikeresen lekérdezve.", issue.ToManagementResponse());
        }

        public async Task<(bool Success, string Message, IssueManagementResponse? Issue)> UpdateAssignedIssueStatusAsync(int issueId, StatusEnum status, int maintainerId)
        {
            if (status is not StatusEnum.InProgress and not StatusEnum.Resolved)
            {
                return (false, "A karbantartó csak Folyamatban vagy Megoldva állapotra módosíthatja a hibát.", null);
            }

            var issue = await _context.Issues
                .Include(i => i.Room)
                .Include(i => i.Equipment)
                .Include(i => i.Reporter)
                .Include(i => i.AssignedMaintainer)
                .FirstOrDefaultAsync(i => i.Id == issueId && i.AssignedMaintainerId == maintainerId);

            if (issue is null)
            {
                return (false, "A hibajegy nem található, vagy nincs hozzád rendelve.", null);
            }

            if (issue.Status == StatusEnum.Closed)
            {
                return (false, "A lezárt hibajegy állapota már nem módosítható karbantartóként.", null);
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

        public async Task<(bool Success, string Message, OrderResponse? Order)> CreateOrderRequestAsync(CreateOrderRequest request, int maintainerId)
        {
            var maintainer = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == maintainerId && u.Role == UserRole.Maintainer);

            if (maintainer is null)
            {
                return (false, "A karbantartó nem található.", null);
            }

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
            return (true, "Az eszközrendelési igény sikeresen rögzítve.", order.ToOrderResponse());
        }

        private IQueryable<Issue> BuildAssignedIssuesQuery(int maintainerId)
        {
            return _context.Issues
                .AsNoTracking()
                .Where(i => i.AssignedMaintainerId == maintainerId)
                .Include(i => i.Room)
                .Include(i => i.Equipment)
                .Include(i => i.Reporter)
                .Include(i => i.AssignedMaintainer);
        }
    }
}
