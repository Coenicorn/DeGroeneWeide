using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

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

            switch (card.level)
            {
                case 0: 
                    level_color.FillColor = Color.Green;
                    level_name.Text = "Gast";
                    break;
                case 1:
                    level_color.FillColor = Color.Blue;
                    level_name.Text = "Bezoeker";
                    break;
                case 2:
                    level_color.FillColor = Color.Orange;
                    level_name.Text = "Medewerker";
                    break;
                case 3:
                    level_color.FillColor = Color.Gray;
                    level_name.Text = "Admin";
                    break;
            }

            bookings_name.Text = "Hier komt voor letter + achternaam";
            bookings_number.Text = $"#{card.booking_id}";
            bookings_date.Text = $"van begin datum tot eind datum";
        }
    }
}
