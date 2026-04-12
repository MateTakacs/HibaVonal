namespace HibaVonal.DataContext.Entities
{
    public class Feedback
    {
        public int Id { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int IssueId { get; set; }
        public Issue Issue { get; set; } = null!;
        public int ReporterId { get; set; }
        public User Reporter { get; set; } = null!;
    }
}