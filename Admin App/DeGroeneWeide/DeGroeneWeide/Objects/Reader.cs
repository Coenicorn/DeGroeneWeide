using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class Reader
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("batteryPercentage")]
        public int BatteryPercentage { get; set; }

        [JsonPropertyName("amenityId")]
        public string? AmenityId { get; set; }

        [JsonPropertyName("lastPing")]
        public string? LastPing { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("active")]
        public int Active { get; set; }

        public Reader() { }

        public void DumpInfo()
        {
            Debug.WriteLine($"Reader - ID: {Id}, Battery: {BatteryPercentage}%, Amenity ID: {AmenityId}, Last Ping: {LastPing}, Name: {Name}, Active: {Active}");
        }
    }
}
