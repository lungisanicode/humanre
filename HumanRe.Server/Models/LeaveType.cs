namespace HumanRe.Server.Models
{
    public class LeaveType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public ICollection<LeaveRequest> LeaveRequests { get; set; }
    }
}
