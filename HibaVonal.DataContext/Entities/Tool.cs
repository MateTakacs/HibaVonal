namespace HibaVonal_backend.Entities
{
    public class Tool
    {
        public int Id { get; set; }
        public int ToolListId { get; set; }
        public ToolList ToolList { get; set; } = null!;
        public string ToolSerial { get; set; } = string.Empty;
    }
}
