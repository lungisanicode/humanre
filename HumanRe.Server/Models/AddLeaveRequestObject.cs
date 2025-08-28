namespace HumanRe.Server.Models
{
    public class AddLeaveRequestObject
    {
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfDays { get; set; }
        public string Reason { get; set; }
        public bool IsApproved { get; set; } = false;
        public bool IsRejected { get; set; } = false;
        public bool IsWithdrawn { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime ModifiedDate { get; set; } = DateTime.UtcNow;

        public int? ApprovedById { get; set; } = null;
        public DateTime? ApprovalDate { get; set; } = null;
        public string RejectionReason { get; set; } = "";
    }
}
