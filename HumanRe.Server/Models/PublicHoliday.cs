namespace HumanRe.Server.Models
{
    public class PublicHoliday
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime HolidayDate { get; set; }
        public int Year { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
