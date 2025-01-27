using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Objects;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
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
        public Edit_Boeking()
        {
            InitializeComponent();
        }

        public void AddBoeking()
        {
            btn_delete.Visible = false;
            btn_save.Visible = false;
            btn_add.Visible = true;
            date_start.MinDate = DateTime.Today;
            date_end.MinDate = DateTime.Today;
            date_birth.MaxDate = DateTime.Today.AddYears(-16);
        }

        public void FillInfo(Booking booking)
        {
            Booking = booking;
            date_start.Value = booking.StartDate;
            if (booking.StartDate > DateTime.Today)
            {
                date_start.MinDate = DateTime.Today;
            }
            else
            {
                date_start.MinDate = booking.StartDate;
            }
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
            firstname.Text = booking.FirstName;
            middlename.Text = booking.MiddleName;
            lastname.Text = booking.LastName;
            date_birth.Value = booking.BirthDate;
            date_birth.MaxDate = DateTime.Today.AddYears(-16);
            phoneNumber.Text = booking.PhoneNumber;
            email.Text = booking.Email;
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
            if (Booking != null && Booking.CustomerId != null)
            {
                await CustomerApi.UpdateCustomer(new Customer(Booking.CustomerId, firstname.Text, middlename.Text, lastname.Text, date_birth.Value, phoneNumber.Text, email.Text));
                await BookingApi.UpdateBooking(new Booking(Booking.Id, Booking.CustomerId, date_start.Value.ToString(), date_end.Value.ToString(), int.Parse(amout_people.Text)));
                this.Close();
            }
        }

        private async void btn_delete_Click(object sender, EventArgs e)
        {
            var result = MessageBox.Show("Weet u zeker dat u deze boeking wilt verwijderen?", "Verwijderen", MessageBoxButtons.YesNo);
            if (Booking != null && Booking.Id != null && result == DialogResult.Yes)
            {
                await BookingApi.DeleteBooking(Booking.Id);
                this.Close();
            }
        }

        private async void btn_add_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(lbl_amountofpeople.Text) || string.IsNullOrEmpty(firstname.Text) || string.IsNullOrEmpty(lastname.Text) ||string.IsNullOrEmpty(email.Text))
            {
                return;
            }

            string CustomerId = await CustomerApi.InsertCustomer(firstname.Text, middlename.Text, lastname.Text, date_birth.Value.ToString(), phoneNumber.Text, email.Text) ?? "";
            Debug.WriteLine($"\n\nNew CustomerId: {CustomerId}");
            await BookingApi.InsertBooking(CustomerId, date_start.Value.ToString(), date_end.Value.ToString(), int.Parse(amout_people.Text));
            this.Close();
        }
    }
}
