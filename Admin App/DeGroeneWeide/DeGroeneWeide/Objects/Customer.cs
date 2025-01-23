using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Customer
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("firstName")]
        public string? FirstName { get; set; }

        [JsonPropertyName("middleName")]
        public string? MiddleName { get; set; }

        [JsonPropertyName("lastName")]
        public string? LastName { get; set; }

        [JsonPropertyName("maySave")]
        public string? MaySave { get; set; }

        [JsonPropertyName("birthDate")]
        public DateTime? BirthDate { get; set; }

        [JsonPropertyName("creationDate")]
        public string? CreationDate { get; set; }

        [JsonPropertyName("blacklisted")]
        public string? BlackListed { get; set; }

        [JsonPropertyName("phoneNumber")]
        public string? PhoneNumber { get; set; }

        [JsonPropertyName("mailAddress")]
        public string? Email { get; set; }
        public Customer() { }

        public void DumpInfo()
        {
            Debug.WriteLine($"Customer - ID: {Id}, Name: {FirstName} {MiddleName} {LastName}, May Save: {MaySave}, Birth Date: {BirthDate}, Creation Date: {CreationDate}, Blacklisted: {BlackListed}, Phone Number: {PhoneNumber}, Email: {Email}");
        }
    }
}
