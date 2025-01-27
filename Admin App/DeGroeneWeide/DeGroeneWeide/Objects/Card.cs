using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Card
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("bookingId")]
        public string? BookingId { get; set; }

        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("blocked")]
        public string? Blocked { get; set; }

        [JsonPropertyName("customerId")]
        public string? CustomerId { get; set; }

        [JsonPropertyName("startDate")]
        public DateTime? StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public DateTime? EndDate { get; set; }

        [JsonPropertyName("amountPeople")]
        public int? AmountPeople { get; set; }

        [JsonPropertyName("bookingCreationDate")]
        public string? bookingCreationDate { get; set; }

        [JsonPropertyName("authLevelId")]
        public string? authLevelId { get; set; }

        [JsonPropertyName("authLevelName")]
        public string? authLevelName { get; set; }

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("middleName")]
        public string? MiddleName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [JsonPropertyName("birthDate")]
        public string? BirthDate { get; set; }

        [JsonPropertyName("blackListed")]
        public string? BlackListed { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonPropertyName("mailAddress")]
        public string? Email { get; set; }

        [JsonPropertyName("customerCreationDate")]
        public string? customerCreationDate { get; set; }

        public Card() { }

        public void DumpInfo()
        {
            Debug.WriteLine($"Card - ID: {Id}, BookingID: {BookingId}, Name: {FirstName} {MiddleName} {LastName}, Start Date: {StartDate}, End Date: {EndDate}, Amount: {AmountPeople}, Blacklisted: {BlackListed}, Phone: {PhoneNumber}, Email: {Email}");
        }
    }
}
