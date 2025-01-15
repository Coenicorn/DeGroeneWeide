using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Booking
    {
        public string? Id { get; set; }
        public string? CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int?  AmountPeople { get; set; }

        public Booking(string? id, string? customerId, string startDate, string endDate, int? amountPeople)
        {
            Id = id;
            CustomerId = customerId;
            StartDate = DateTime.Parse(startDate);
            EndDate = DateTime.Parse(endDate);
            AmountPeople = amountPeople;
        }

        public Booking() { }

        public void DumpInfo()
        {
            Debug.WriteLine($"Boeking - id: {Id}, customerId {CustomerId}, Start date: {StartDate.ToString("dd-MM-yyyy")}, End date {EndDate.ToString("dd-MM-yyyy")}, Amount of people: {AmountPeople}");
        }
        
    }
}
