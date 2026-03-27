namespace HibaVonal_backend.Entities
{
    public class ToolList
    {
        public int Id { get; set; }
        public string ToolMaker { get; set; } = string.Empty;
        public string ToolModel { get; set; } = string.Empty;
        public int ToolPrice { get; set; }
    }
}
