using DeGroeneWeide.Forms;
using DeGroeneWeide.Objects;

namespace DeGroeneWeide
{
    public partial class UC_Pasje : UserControl
    {
        private Card c;
        private UC_PasjesPagina p;
        public UC_Pasje()
        {
            InitializeComponent();
        }


        // Laad voor elk pasje de goede gegevens in zodat deze goed weer gegeven worden.
        public void LoadData(Card card, UC_PasjesPagina pagina)
        {
            c = card;
            p = pagina;
            if (card == null) { return; }

            switch (card.authLevelName)
            {
                case "gast":
                    level_color.FillColor = Colors.Gast;
                    level_name.Text = "Gast";
                    break;
                case "bezoeker":
                    level_color.FillColor = Colors.Bezoeker;
                    level_name.Text = "Bezoeker";
                    break;
                case "medewerker":
                    level_color.FillColor = Colors.MedeWerker;
                    level_name.Text = "Medewerker";
                    break;
                case "admin":
                    level_color.FillColor = Colors.Admin;
                    level_name.Text = "Admin";
                    break;
                default:
                    level_color.FillColor = Colors.Cross;
                    level_name.Text = "Geen";
                    break;
            }

            if (card.BookingId == null || card.FirstName == null)
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

        private void btn_edit_Click(object sender, EventArgs e)
        {
            Edit_Card edit = new();
            edit.FillComboBox();
            edit.Fill(c);
            edit.ShowDialog();
            p.LoadCards();
        }
    }
}
