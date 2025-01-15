using DeGroeneWeide.ApiCalls;
using System.Diagnostics;

namespace DeGroeneWeide
{
    public partial class UC_PasjesPagina : UserControl
    {
        public UC_PasjesPagina()
        {
            InitializeComponent();
            LoadCards();
        }

        // Laad alle pasje die opgehaald zijn uit de database.
        public async void LoadCards()
        {
            await CardApi.GetCards();
            cards_container.Controls.Clear();
            if (CardApi.Cards != null)
            {
                foreach (var card in CardApi.Cards)
                {
                    UC_Pasje pasje = new();
                    cards_container.Controls.Add(pasje);
                    pasje.LoadData(card);
                }
            }
        }
    }
}
