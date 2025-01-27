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
    public partial class Edit_Card : Form
    {
        public Edit_Card()
        {
            InitializeComponent();
        }

        public async void FillComboBox()
        {
            await BookingApi.GetBooking();
            foreach (Booking b in BookingApi.Bookings)
            {
                combox_boekingen.Items.Add($"{b.Id} - {b.FirstName} {b.MiddleName} {b.LastName}".Replace("  ", " "));
            }
        }

        public void Fill(Card c)
        {
            combox_boekingen.Text = $"{c.BookingId} - {c.FirstName} {c.MiddleName} {c.LastName}".Replace("  ", " ");
            switch (c.authLevelName)
            {
                case "gast":
                    btn_gast.Checked = true;
                    break;
                case "bezoeker":
                    btn_bezoeker.Checked = true;
                    break;
                case "medewerker":
                    btn_medewerker.Checked = true;
                    break;
                case "admin":
                    btn_admin.Checked = true;
                    break;
            }
        }

        private void btn_save_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
