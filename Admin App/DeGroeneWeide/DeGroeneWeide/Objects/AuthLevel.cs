using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide.Objects
{
    public class AuthLevel
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        public AuthLevel() { }

        public AuthLevel(string id, string name) {
            Id = id;
            Name = name;
        }

        public void DumpInfo()
        {
            Debug.WriteLine($"Auth - ID: {Id}, Name: {Name}");
        }
    }
}
