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
                HttpResponseMessage result = await client.GetAsync(Properties.Settings.Default.URL + "/customers/getAllCustomers");
                result.EnsureSuccessStatusCode();

                string json = await result.Content.ReadAsStringAsync();

                Customers = JsonSerializer.Deserialize<List<Customer>>(json);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

        }

        public static async Task<string?> UpdateCustomer(Customer c)
        {
            string URL = $"{Properties.Settings.Default.URL}/customers/updateCustomer";
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                customerId = c.Id,
                firstName = c.FirstName,
                middleName = c.MiddleName,
                lastName =  c.LastName,
                maySave = 0,
                birthDate = c.BirthDate,
                blacklisted = 0,
                phoneNumber = c.PhoneNumber,
                mailAddress = c.Email
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

        public static async Task<string?> InsertCustomer(string firstname, string middlename, string lastname, DateTime birthdate, string phonenumber, string mailaddress)
        {
            await AddHeaders.AddHeadersToClient(client);

            var data = new
            {
                firstName = firstname,
                middleName = middlename,
                lastName = lastname,
                birthDate = birthdate,
                maySave = 0,
                creationDate = DateTime.Now,
                blacklisted = 0,
                phoneNumber = phonenumber,
                mailAddress = mailaddress
            };

            string json = JsonSerializer.Serialize(data);
            StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");

            HttpResponseMessage response = await client.PostAsync(Properties.Settings.Default.URL + "/customers/insertCustomer", content);
            string responseString = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var dictionary = JsonSerializer.Deserialize<Dictionary<string, string>>(responseString);
                return dictionary?["customerId"];
            }
            else
            {
                Console.WriteLine("Error: " + response.StatusCode);
                return null;
            }
        }
    }
}
