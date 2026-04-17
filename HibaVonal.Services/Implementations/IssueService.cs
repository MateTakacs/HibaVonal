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
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.RoomNum == request.RoomNum);

            if (room == null)
                return (false, "Ez a szobaszám nem létezik.", null);

            var reporter = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == reporterId);

            if (reporter == null)
                return (false, "A felhasználó nem található.", null);

            if (reporter.RoomNum != room.Id)
                return (false, "Csak a saját szobádban lévő hibát jelenthetsz be.", null);

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

            if (issue.ReporterId != reporterId)
                return (false, "Nincs jogosultságod ezt a hibabejelentést módosítani.");

            if (issue.Status != StatusEnum.Open)
                return (false, "Csak nyitott státuszú hibabejelentést lehet módosítani.");

            issue.Description = request.Description;
            issue.Urgency = request.Urgency;

            await _context.SaveChangesAsync();
            return (true, "Hibabejelentés sikeresen módosítva!");
        }

        // Kollégista: szobához tartozó berendezések lekérdezése
        public async Task<List<EquipmentResponse>> GetEquipmentsByRoomNumAsync(int roomNum)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.RoomNum == roomNum);

            if (room == null)
                return [];

            var equipments = await _context.RoomEquips
                .Where(re => re.RoomId == room.Id)
                .Include(re => re.Equipment)
                .Select(re => new EquipmentResponse(re.Equipment.Id, re.Equipment.EquipName))
                .ToListAsync();

            return equipments;
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