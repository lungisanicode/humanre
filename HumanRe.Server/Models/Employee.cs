namespace HumanRe.Server.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string EmailAddress { get; set; }
        public string CellphoneNumber { get; set; }
        public int? TeamId { get; set; }
        public bool IsManager { get; set; }
        public bool IsTeamLead { get; set; }
        public int? ManagerId { get; set; }
        public string ManagerEmail { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

        public Team Team { get; set; }
        public Employee Manager { get; set; }
        public ICollection<Employee> Subordinates { get; set; }
        public ICollection<LeaveRequest> LeaveRequests { get; set; }
    }
}
