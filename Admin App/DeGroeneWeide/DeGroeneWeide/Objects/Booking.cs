using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Booking
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("customerId")]
        public string? CustomerId { get; set; }

        [JsonPropertyName("startDate")]
        public DateTime StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public DateTime EndDate { get; set; }

        [JsonPropertyName("amountPeople")]
        public int? AmountPeople { get; set; }

        [JsonPropertyName("creationDate")]
        public DateTime CreationDate { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("confirmed")]
        public int? Confirmed { get; set; }

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("middleName")]
        public string? MiddleName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [JsonPropertyName("customerCreationDate")]
        public DateTime CustomerCreationDate { get; set; }

        [JsonPropertyName("blacklisted")]
        public int? BlackListed { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonPropertyName("mailAddress")]
        public string? Email { get; set; }

        //public string Notes

        public Booking(string? id, string? customerId, string startDate, string endDate, int? amountPeople, string creationDate, string notes, int confirmed, string firstName, string middleName, string lastName, string customerCreationDate, int blackListed, string phoneNumber, string email)
        {
            Id = id;
            CustomerId = customerId;
            StartDate = DateTime.Parse(startDate);
            EndDate = DateTime.Parse(endDate);
            AmountPeople = amountPeople;
            CreationDate = DateTime.Parse(creationDate);
            Confirmed = confirmed;
            FirstName = firstName;
            MiddleName = middleName;
            LastName = lastName;
            CustomerCreationDate = DateTime.Parse(customerCreationDate);
            BlackListed = blackListed;
            PhoneNumber = phoneNumber;
            Email = email;
        }

        public Booking(string? id, string customerId, string startDate, string endDate, int amountPeople)
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
