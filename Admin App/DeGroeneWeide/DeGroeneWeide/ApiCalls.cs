using System.Diagnostics;
using System.Text.Json;
using System.Text;

namespace DeGroeneWeide
{
    internal class ApiCalls
    {
        public static List<Reader>? Readers;
        public static List<Card>? Cards;

        // Haalt alle readers uit de database op.    
        public static void GetReaders()
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var endpoint = new Uri("http://92.108.61.219:13999/api/readers/getAllReaders");
            var result = client.GetAsync(endpoint).Result;
            var json = result.Content.ReadAsStringAsync().Result;
            Debug.WriteLine(json);

            Readers = JsonSerializer.Deserialize<List<Reader>>(json);

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

            var endpoint = new Uri("http://92.108.61.219:13999/api/cards/getNewestCardToWrite");
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
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                var endpoint = new Uri("http://92.108.61.219:13999/api/cards/getAllCards");
                var result = await client.GetAsync(endpoint);
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
            using var client = new HttpClient();

            var endpoint = new Uri("http://example.com/api/data");
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

            var response = client.PostAsync(endpoint, content);
        }

        // Je kunt alleen 'name' en 'amenityId' wijzigen.
        public static void EditReader(Reader reader)
        {
            //test om te kijken of hij het aanpast
            reader.SetAmenity(10);

            using HttpClient client = new HttpClient();

            Uri endpoint = new Uri("http://92.108.61.219:13999/api/readers/updateReader");
            client.DefaultRequestHeaders.Add("Accept", "application/json");

            var data = new
            {
                name = reader.location,
                reader.amenityId
            };

            var json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = client.PostAsync(endpoint.ToString(), content);


        }

    }
}
