namespace HibaVonal_backend.Entities
{
    public enum OrderStatus
    {
        Pending,
        InProgress,
        Completed,
        Cancelled
    }
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public OrderStatus Status { get; set; }
        public int ToolListId { get; set; }
        public ToolList ToolList { get; set; } = null!;
    }
}
