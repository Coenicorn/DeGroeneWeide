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
    internal class CustomerApi
    {
        public static List<Customer>? Customers;
        public static HttpClient client = new();
        public static async Task GetCards()
        {
            if (!client.DefaultRequestHeaders.Contains("Accept"))
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");
            }

            try
            {
                HttpResponseMessage result = await client.GetAsync(MainForm._settings.URL + "/customers/getAllCustomers");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine("Customers JSON: " +json);

                Customers = JsonSerializer.Deserialize<List<Customer>>(json);
                foreach (Customer customer in Customers)
                {
                    customer.DumpInfo();
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }
    }
}
