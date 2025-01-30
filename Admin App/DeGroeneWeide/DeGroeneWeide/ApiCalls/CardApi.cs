using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Guna.UI2.WinForms.Suite.Descriptions;

namespace DeGroeneWeide.ApiCalls
{
    internal class CardApi
    {
        public static List<Card>? Cards;
        public static HttpClient client = new();
        public static async Task<Card?> GetLastCard()
        {
            await AddHeaders.AddHeadersToClient(client);

            try
            {
                HttpResponseMessage result = await client.GetAsync(Properties.Settings.Default.URL + "/cards/getNewestCardToWrite");
                result.EnsureSuccessStatusCode();

                string json = result.Content.ReadAsStringAsync().Result;
                Debug.WriteLine(json);

                return JsonSerializer.Deserialize<Card>(json);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
                return null;
            }
        }

        public static async Task GetCards()
        {
            await AddHeaders.AddHeadersToClient(client);

            try
            {
                HttpResponseMessage result = await client.GetAsync(Properties.Settings.Default.URL + "/cards/getallextensivecards");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                json = json.Replace("\"blocked\":false", "\"blocked\":\"false\"")
                           .Replace("\"blocked\":true", "\"confirmed\":\"true\"")
                           .Replace("\"blacklisted\":false", "\"blacklisted\":\"false\"")
                           .Replace("\"blacklisted\":true", "\"blacklisted\":\"true\"");
                json = json.Replace("\"blocked\":0", "\"blocked\":\"false\"")
                           .Replace("\"blocked\":1", "\"blocked\":\"true\"")
                           .Replace("\"blacklisted\":0", "\"blacklisted\":\"false\"")
                           .Replace("\"blacklisted\":1", "\"blacklisted\":\"true\"");
                Debug.WriteLine($"Cards JSON: {json}");

                Cards = JsonSerializer.Deserialize<List<Card>>(json);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }

        public static async Task AddCard(int booking_Id, string card_Uuid)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                card_uuid = card_Uuid,
                booking_id = booking_Id,
                blocked = false
            };

            string json = JsonSerializer.Serialize(data);
            Debug.WriteLine(json);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/cards/insertCard", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine("Add card: " + responseString);
        }

        public static async Task UpdateCard(string card_id, string Booking_id)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                id = card_id,
                booking_id = Booking_id
            };

            string json = JsonSerializer.Serialize(data);
            Debug.WriteLine($"card JSON {json}");
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/cards/updateCard", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine($"Response is code: {response.StatusCode} Response String: {responseString}");
        }
    }
}
