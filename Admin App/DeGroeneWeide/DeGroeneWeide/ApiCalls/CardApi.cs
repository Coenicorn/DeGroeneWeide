using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

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
                HttpResponseMessage result = await client.GetAsync(MainForm._settings.URL + "/cards/getNewestCardToWrite");
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
                HttpResponseMessage result = await client.GetAsync(MainForm._settings.URL + "/cards/getallextensivecards");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine(json);

                Cards = JsonSerializer.Deserialize<List<Card>>(json);
                if(Cards != null)
                {
                    foreach (Card c in Cards)
                    {
                        c.DumpInfo();
                    }
                }
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

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/cards/insertCard", content);
            string responseString = await response.Content.ReadAsStringAsync();
            Debug.WriteLine("Add card: " + responseString);
        }

        public static async Task UpdateCard(string id, string card_uuid, string booking_id, string token, string level, string blocked)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                //id = b.Id,
                //customerId = b.CustomerId,
                //startDate = b.StartDate,
                //endDate = b.EndDate,
                //amountPeople = b.AmountPeople,
                //notes = ""
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/booking/updateBooking", content);
            string responseString = await response.Content.ReadAsStringAsync();
        }
    }
}
