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
    }


    // Een class waar alle gegevens van de readers worden opgeslagen.
    public class Reader
    {
        [JsonPropertyName("id")]
        public string? id { get; set; }

        [JsonPropertyName("macAddress")]
        public string? macAddress { get; set; }

        [JsonPropertyName("location")]
        public string? location { get; set; }

        [JsonPropertyName("battery")]
        public float? battery { get; set; }

        [JsonPropertyName("active")]
        public int? active { get; set; }

        [JsonPropertyName("lastUpdate")]
        public string? lastUpdate { get; set; }

        public void DumpInfo()
        {
            Debug.WriteLine($"Id: {id}, Mac: {macAddress}, Location: {location}, Battery: {battery}, Active: {active}, Last Update: {lastUpdate}");
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
        [JsonConverter(typeof(NullableBoolJsonConverter))]
        public bool? blocked { get; set; }

        public void DumpInfo()
        {
            Debug.WriteLine($"Id: {id}, card uuid: {card_uuid}, booking id: {booking_id}, token: {token}, level: {level}, blocked: {blocked}");
        }
    }


    // Een class die zorgt dat een boolean convert kan worden vanuit een json
    public class NullableBoolJsonConverter : JsonConverter<bool?>
    {
        public override bool? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.True || reader.TokenType == JsonTokenType.False)
            {
                // Handle boolean values
                return reader.GetBoolean();
            }
            else if (reader.TokenType == JsonTokenType.String)
            {
                // Handle string values
                var stringValue = reader.GetString();
                if (bool.TryParse(stringValue, out var result))
                {
                    return result;
                }
            }
            else if (reader.TokenType == JsonTokenType.Number)
            {
                // Handle numeric values
                if (reader.TryGetInt32(out var intValue))
                {
                    // Assume non-zero values represent `true`
                    return intValue != 0;
                }
            }

            // If parsing fails, return null
            return null;
        }

        public override void Write(Utf8JsonWriter writer, bool? value, JsonSerializerOptions options)
        {
            if (value.HasValue)
            {
                writer.WriteBooleanValue(value.Value);
            }
            else
            {
                writer.WriteNullValue();
            }
        }
    }
}
