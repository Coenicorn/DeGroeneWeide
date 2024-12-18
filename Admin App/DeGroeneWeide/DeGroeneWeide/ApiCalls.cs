﻿using System.Diagnostics;
using System.Text.Json;
using System.Text;

namespace DeGroeneWeide
{
    internal class ApiCalls
    {
        public static List<Reader>? Readers;
        public static List<Card>? Cards;
        public static HttpClient client = new(); 

        // Haalt alle readers uit de database op.    
        public static async Task GetReaders()
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            try
            {
                HttpResponseMessage result = await client.GetAsync("http://localhost:3001/api/readers/getAllReaders");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine("Alle Readers: " + json);

                Readers = JsonSerializer.Deserialize<List<Reader>>(json);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            if(Readers != null)
            {
                foreach (var reader in Readers)
                {
                    reader.DumpInfo();
                }
            }
        }

        // Haalt het laatst gescande pasje aan de balie uit de database op.
        public static Card? GetLastCard()
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var endpoint = new Uri("http://localhost:3001/api/cards/getNewestCardToWrite");
            var result = client.GetAsync(endpoint).Result;
            var json = result.Content.ReadAsStringAsync().Result;
            Debug.WriteLine(json);

            if (!result.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Failed to fetch card. Status code: {result.StatusCode}");
                return null;
            }

            return JsonSerializer.Deserialize<Card>(json);

            //if (Readers != null)
            //{
            //    foreach (var reader in Readers)
            //    {
            //        reader.DumpInfo();
            //    }
            //}
        }

        // Haalt alle geregistreerde pasjes uit de database op.
        public static async Task GetCards()
        {
            try
            {
                HttpClient client = new();
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var result = await client.GetAsync("http://localhost:3001/api/cards/getAllCards");
                var json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine(json);

                Cards = JsonSerializer.Deserialize<List<Card>>(json);

                if (Cards != null)
                {
                    foreach (var card in Cards)
                    {
                        card.DumpInfo();
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }

        // Voegt een pasje toe aan de database
        public static void AddCard(int booking_Id, string card_Uuid)
        {
            HttpClient client = new();

            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var data = new
            {
                card_uuid = card_Uuid,
                booking_id = booking_Id,
                //token = ,
                blokced = false
            };

            var json = JsonSerializer.Serialize(data);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = client.PostAsync("http://example.com/api/data", content);
        }

        // Je kunt alleen 'name' en 'amenityId' wijzigen.
        public static void EditReader(Reader reader)
        {
            //test om te kijken of hij het aanpast
            //reader.SetAmenity(10);

            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var data = new
            {
                name = reader.name,
                reader.amenityId
            };

            var json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = client.PostAsync("http://localhost:3001/api/readers/updateReader".ToString(), content);


        }

    }
}
