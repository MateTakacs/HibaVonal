using HibaVonal.Services.DTOs;

namespace HibaVonal.Services.Interfaces
{
    public interface IIssueService
    {
        // Kollégista: hibabejelentés
        Task<(bool Success, string Message, IssueResponse? Issue)> CreateIssueAsync(CreateIssueRequest request, int reporterId);

        // Kollégista: saját hibák lekérdezése
        Task<List<IssueResponse>> GetMyIssuesAsync(int reporterId);

        // Kollégista: hibabejelentés módosítása
        Task<(bool Success, string Message)> UpdateIssueAsync(int issueId, UpdateIssueRequest request, int reporterId);

        // Kollégista: szobához tartozó berendezések lekérdezése
        Task<List<EquipmentResponse>> GetEquipmentsByRoomNumAsync(int roomNum);
    }
}