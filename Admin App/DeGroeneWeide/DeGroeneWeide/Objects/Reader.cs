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
        public string? Id { get; set; }
        public int? Battery { get; set; }
        public string? AmenityId { get; set; }
        public string? LastPing { get; set; }
        public string? Name { get; set; }
        public int? Active { get; set; }

        public Reader(string? id, int? batteryPercentage, string? amenityId, string? lastPing, string? name, int? active) {
            Id = id;
            Battery = batteryPercentage;
            AmenityId = amenityId;
            LastPing = lastPing;
            Name = name;
            Active = active;
        }

        public void DumpInfo()
        { 
            Debug.WriteLine($"Reader - Id: {Id}, battery percentage {Battery}, amenity id {AmenityId}, last ping {LastPing}, name {Name}, active {Active}");
        }
    }
}
