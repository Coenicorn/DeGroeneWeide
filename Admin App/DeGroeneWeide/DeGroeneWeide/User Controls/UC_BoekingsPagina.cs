using DeGroeneWeide.ApiCalls;
using DeGroeneWeide.Forms;
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

namespace DeGroeneWeide.User_Controls
{
    public partial class UC_BoekingsPagina : UserControl
    {
        public UC_BoekingsPagina()
        {
            InitializeComponent();
            LoadInfo();
        }

        public async void LoadInfo()
        {
            await BookingApi.GetBooking();
            await CustomerApi.GetCustomers();
            container.Controls.Clear();
            foreach (Booking bookingen in BookingApi.Bookings)
            {
                Debug.WriteLine("Boeking id: " + bookingen.Id);
                UC_Boeking uc = new();
                container.Controls.Add(uc);
                uc.FillInfo(bookingen, this);
            }
        }

        private void btn_refresh_Click(object sender, EventArgs e)
        {
            LoadInfo();
        }

        private void btn_add_Click(object sender, EventArgs e)
        {
            Edit_Boeking add = new();
            add.AddBoeking();
            add.ShowDialog();
            LoadInfo();
        }
    }
}
