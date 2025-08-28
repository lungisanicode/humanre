using System.Text.Json.Serialization;

namespace HumanRe.Server.Models
{
    public class LeaveRequest
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int NumberOfDays { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; } = "Pending"; 
        public bool IsApproved { get; set; }
        public bool IsRejected { get; set; }
        public bool IsWithdrawn { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int? ApprovedById { get; set; }
        public DateTime? ApprovalDate { get; set; }
        public string RejectionReason { get; set; }
        [JsonIgnore]
        public Employee? Employee { get; set; }
        [JsonIgnore]
        public Employee? ApprovedBy { get; set; }
    }
}
