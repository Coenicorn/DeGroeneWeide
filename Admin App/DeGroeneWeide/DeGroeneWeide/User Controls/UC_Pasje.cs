using DeGroeneWeide.Objects;

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

            switch (Convert.ToInt32(card.Id))
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

            if(card.BookingId == null || card.FirstName == null)
            {
                bookings_name.Visible = false;
                bookings_number.Visible = false;
                bookings_date.Visible = false;
                return;
            }
            bookings_name.Text = $"{card.FirstName[0].ToString().ToUpper()}. {card.MiddleName} {card.LastName}".Replace("  ", " ");
            bookings_number.Text = $"#{card.BookingId}";
            bookings_date.Text = $"van {card.StartDate:dd-MM-yyyy} tot {card.EndDate:dd-MM-yyyy}";
        }

        private void guna2Panel1_Paint(object sender, PaintEventArgs e)
        {

        }
    }
}
