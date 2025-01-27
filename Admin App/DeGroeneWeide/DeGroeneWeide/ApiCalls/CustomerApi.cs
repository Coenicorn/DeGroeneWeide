using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DeGroeneWeide.ApiCalls
{
    internal class CustomerApi
    {
        public static List<Customer>? Customers;
        public static HttpClient client = new();
        public static async Task GetCustomers()
        {
            await AddHeaders.AddHeadersToClient(client);

            try
            {
                HttpResponseMessage result = await client.GetAsync(MainForm._settings.URL + "/customers/getAllCustomers");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();
                Debug.WriteLine("Customers JSON: " +json);

                Customers = JsonSerializer.Deserialize<List<Customer>>(json);
                if (Customers != null)
                {
                    foreach (Customer customer in Customers)
                    {
                        customer.DumpInfo();
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }

        public static async Task<string?> UpdateCustomer(Customer c)
        {
            string URL = $"{MainForm._settings.URL}/readers/getAllAuthLevels";
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                id = c.Id,
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(URL, content);
            string responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                return JsonSerializer.Serialize(responseString);
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return null;
            }
        }

        public static async Task<string?> InsertCustomer(string firstname, string middlename, string lastname, string birthdate, string phonenumber, string mailaddress)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                firstName = firstname,
                middleName = middlename,
                lastName = lastname,
                maySave = 0,
                birthDate = birthdate,
                blacklisted = false,
                phoneNumber = phonenumber,
                mailAddress = mailaddress
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(MainForm._settings.URL + "/customers/insertCustomer", content);
            string responseString = await response.Content.ReadAsStringAsync();


            if (response.IsSuccessStatusCode)
            {
                return JsonSerializer.Serialize(responseString);
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return null;
            }
        }
    }
}
