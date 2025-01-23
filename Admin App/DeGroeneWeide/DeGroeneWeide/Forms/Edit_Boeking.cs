using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DeGroeneWeide.Forms
{
    public partial class Edit_Boeking : Form
    {
        private Booking? Booking;
        private Customer? Customer;
        public Edit_Boeking()
        {
            InitializeComponent();
        }

        public void FillInfo(Booking booking, Customer customer)
        {
            Booking = booking; Customer = customer;
            date_start.Value = booking.StartDate;
            date_start.MinDate = booking.StartDate;
            date_end.Value = booking.EndDate;
            if (booking.StartDate > DateTime.Today)
            {
                date_end.MinDate = booking.StartDate;
            }
            else
            {
                date_end.MinDate = DateTime.Today;
            }
            date_start.MaxDate = date_end.Value;
            amout_people.Text = booking.AmountPeople.ToString();
            firstname.Text = customer.FirstName;
            middlename.Text = customer.MiddleName;
            lastname.Text = customer.LastName;
            date_birth.Value = customer.BirthDate ?? DateTime.Today;
            date_birth.MaxDate = DateTime.Today.AddYears(-16);
            phoneNumber.Text = customer.PhoneNumber;
            email.Text = customer.Email;
        }

        private void date_end_ValueChanged(object sender, EventArgs e)
        {
            if (date_end.Value > date_start.MinDate)
            {
                date_start.MaxDate = date_end.Value;
            }
        }

        private void date_start_ValueChanged(object sender, EventArgs e)
        {
            if (date_start.Value > DateTime.Today)
            {
                date_end.MinDate = date_start.Value;
            }
            else
            {
                date_end.MinDate = DateTime.Today;
            }
        }

        private async void btn_save_Click(object sender, EventArgs e)
        {
            if (Booking != null)
            {
                //await CustomerApi.UpdateCustomer(new Customer());
                await BookingApi.UpdateBooking(new Booking(Booking.Id, Booking.CustomerId, date_start.Value.ToString(), date_end.Value.ToString(), int.Parse(amout_people.Text)));
                this.Close();
            }
        }
    }
}
