using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DeGroeneWeide
{
    internal class Classes
    {
        public static DateTime EpochToDateTime(long epochTime)
        {
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(epochTime);
            return dateTimeOffset.DateTime;
        }
    }


    // Een class waar alle gegevens van de readers worden opgeslagen.
    public class Reader
    {
        [JsonPropertyName("id")]
        public string? id { get; set; }

        [JsonPropertyName("batteryPercentage")]
        public int? battery { get; set; }

        [JsonPropertyName("amenityId")]
        public string? amenityId { get; set; }

        [JsonPropertyName("lastPing")]
        public string? lastPing { get; set; }

        [JsonPropertyName("name")]
        public string? name { get; set; }

        [JsonPropertyName("active")]
        public int? active { get; set; }


        public void DumpInfo()
        {
            Debug.WriteLine($"Reader - Id: {id}, battery percentage {battery}, amenity id {amenityId}, last ping {lastPing}, last ping date {lastPingDate}, time? {DateTime.Now} name {name}, active {active}");
        }
    }


    // Een class waar alle gegevens voor een pajse worden opgeslagen
    public class Card
    {
        [JsonPropertyName("id")]
        public string? id { get; set; }

        [JsonPropertyName("card_uuid")]
        public string? card_uuid { get; set; }

        [JsonPropertyName("booking_Id")]
        public string? booking_id { get; set; }

        [JsonPropertyName("token")]
        public string? token { get; set; }

        [JsonPropertyName("level")]
        public int? level { get; set; }

        [JsonPropertyName("blocked")]
        public int? blocked { get; set; }

        public void DumpInfo()
        {
            Debug.WriteLine($"Id: {id}, card uuid: {card_uuid}, booking id: {booking_id}, token: {token}, level: {level}, blocked: {blocked}");
        }
    }
}
