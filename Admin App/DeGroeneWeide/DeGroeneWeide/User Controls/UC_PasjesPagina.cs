using System.Diagnostics;

namespace DeGroeneWeide
{
    public partial class UC_PasjesPagina : UserControl
    {
        public UC_PasjesPagina()
        {
            InitializeComponent();
            _ = LoadCards();
        }

        // Laad alle pasje die opgehaald zijn uit de database.
        public async Task LoadCards()
        {
            await ApiCalls.GetCards();
            cards_container.Controls.Clear();
            if (ApiCalls.Cards != null)
            {
                foreach (var card in ApiCalls.Cards)
                {
                    UC_Pasje pasje = new();
                    pasje.LoadData(card);
                    cards_container.Controls.Add(pasje);
                }
            }
        }

        // Opent het menu om een pasje toe te voegen en kijkt of dat er een pasje gevonden is.
        private void Btn_plus_Click(object sender, EventArgs e)
        {
            var lastCard = ApiCalls.GetLastCard();
            addCard.Visible = true;
            if (lastCard == null)
            {
                Debug.WriteLine("Er is geen pasje gevonden");
                Lbl_Card_Found.Text = "Geen pas gevonden";
                Btn_AddCard.Enabled = false;
            }
            else
            {
                Debug.WriteLine("Er is een pasje gevonden");
                Lbl_Card_Found.Text = "Pas gevonden";
                Btn_AddCard.Enabled = true;
            }
        }


        // Sluit het menu om een pasje toe te voegen.
        private void Btn_close_AddCard_Click(object sender, EventArgs e)
        {
            addCard.Visible = false;
        }

        // Voegt een pasje toe aan de database.
        private void Btn_AddCard_Click(object sender, EventArgs e)
        {
            // Hier komt een functie gecalled die een pasje toevoegd aan de database.
        }
    }
}
