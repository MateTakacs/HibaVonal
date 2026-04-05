namespace HibaVonal.DataContext.Entities
{
    public enum StatusEnum
    {
        Open,
        InProgress,
        Resolved,
        Closed
    }
    public enum UrgencyEnum
    {
        Low,
        Medium,
        High
    }
    public class Issue
    {
        public int Id { get; set; }
        public DateTime ReportDate { get; set; }
        public string Description { get; set; } = string.Empty;
        public StatusEnum Status { get; set; }
        public UrgencyEnum Urgency { get; set; }
        public int? ReporterId { get; set; }
        public User Reporter { get; set; } = null!;
        public int? AssignedMaintainerId { get; set; }
        public User? AssignedMaintainer { get; set; } = null!;
        public int? RoomNum { get; set; }
        public Room? Room { get; set; } = null!;
        public int? EquipmentId { get; set; } 
        public Equipment? Equipment { get; set; }

    }
}
