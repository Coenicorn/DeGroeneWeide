﻿using DeGroeneWeide.Objects;

namespace DeGroeneWeide
{
    public partial class UC_Pasje : UserControl
    {
        public UC_Pasje()
        {
            InitializeComponent();
        }


        // Laad voor elk pasje de goede gegevens in zodat deze goed weer gegeven worden.
        public void LoadData(Card card)
        {
            if (card == null) { return; }

            switch (card.Level)
            {
                case 0:
                    level_color.FillColor = Colors.Gast;
                    level_name.Text = "Gast";
                    break;
                case 1:
                    level_color.FillColor = Colors.Bezoeker;
                    level_name.Text = "Bezoeker";
                    break;
                case 2:
                    level_color.FillColor = Colors.MedeWerker;
                    level_name.Text = "Medewerker";
                    break;
                case 3:
                    level_color.FillColor = Colors.Admin;
                    level_name.Text = "Admin";
                    break;
            }

            bookings_name.Text = "Hier komt voor letter + achternaam";
            bookings_number.Text = $"#{card.Booking_id}";
            bookings_date.Text = $"van begin datum tot eind datum";
        }

        private void guna2Panel1_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
