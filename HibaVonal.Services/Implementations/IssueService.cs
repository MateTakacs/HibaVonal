using HibaVonal.DataContext.DB;
using HibaVonal.DataContext.Entities;
using HibaVonal.Services.DTOs;
using HibaVonal.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HibaVonal.Services.Implementations
{
    public class IssueService : IIssueService
    {
        private readonly HibaVonalDBContext _context;

        public IssueService(HibaVonalDBContext context)
        {
            _context = context;
        }

        // Kollégista: hibabejelentés
        public async Task<(bool Success, string Message, IssueResponse? Issue)> CreateIssueAsync(CreateIssueRequest request, int reporterId)
        {
            // létezik-e a szoba
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.RoomNum == request.RoomNum);

            if (room == null)
                return (false, "Ez a szobaszám nem létezik.", null);

            // a kollégista valóban ebben a szobában lakik
            var reporter = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == reporterId);

            if (reporter == null)
                return (false, "A felhasználó nem található.", null);

            if (reporter.RoomNum != room.Id)
                return (false, "Csak a saját szobádban lévő hibát jelenthetsz be.", null);

            // ha megadott berendezést, az valóban ebben a szobában van-e
            if (request.EquipmentId.HasValue)
            {
                var roomEquip = await _context.RoomEquips
                    .FirstOrDefaultAsync(re => re.EquipId == request.EquipmentId && re.RoomId == room.Id);

                if (roomEquip == null)
                    return (false, "Ez a berendezés nem található a megadott szobában.", null);
            }

            var issue = new Issue
            {
                Description = request.Description,
                Urgency = request.Urgency,
                Status = StatusEnum.Open,
                ReportDate = DateTime.UtcNow,
                ReporterId = reporterId,
                RoomNum = room.Id,
                EquipmentId = request.EquipmentId
            };

            _context.Issues.Add(issue);
            await _context.SaveChangesAsync();

            var response = MapToResponse(issue);
            return (true, "Hibabejelentés sikeresen létrehozva!", response);
        }

        // Kollégista: saját hibák lekérdezése
        public async Task<List<IssueResponse>> GetMyIssuesAsync(int reporterId)
        {
            var issues = await _context.Issues
                .Where(i => i.ReporterId == reporterId)
                .OrderByDescending(i => i.ReportDate)
                .ToListAsync();

            return issues.Select(MapToResponse).ToList();
        }

        // Kollégista: hibabejelentés módosítása
        public async Task<(bool Success, string Message)> UpdateIssueAsync(int issueId, UpdateIssueRequest request, int reporterId)
        {
            var issue = await _context.Issues
                .FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue == null)
                return (false, "A hibabejelentés nem található.");

            // valóban a bejelentkezett felhasználóé
            if (issue.ReporterId != reporterId)
                return (false, "Nincs jogosultságod ezt a hibabejelentést módosítani.");

            // csak Open státuszú hibát lehet módosítani
            if (issue.Status != StatusEnum.Open)
                return (false, "Csak nyitott státuszú hibabejelentést lehet módosítani.");

            // 4. Módosítás
            issue.Description = request.Description;
            issue.Urgency = request.Urgency;

            await _context.SaveChangesAsync();
            return (true, "Hibabejelentés sikeresen módosítva!");
        }

        private static IssueResponse MapToResponse(Issue issue)
        {
            return new IssueResponse(
                issue.Id,
                issue.Description,
                issue.Status.ToString(),
                issue.Urgency.ToString(),
                issue.ReportDate,
                issue.RoomNum,
                issue.EquipmentId
            );
        }
    }
}