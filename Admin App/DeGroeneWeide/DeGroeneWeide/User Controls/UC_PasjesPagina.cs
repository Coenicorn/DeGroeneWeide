using DeGroeneWeide.ApiCalls;
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
            await CardApi.GetCards();
            cards_container.Controls.Clear();
            if (CardApi.Cards != null)
            {
                foreach (var card in CardApi.Cards)
                {
                    UC_Pasje pasje = new();
                    pasje.LoadData(card);
                    cards_container.Controls.Add(pasje);
                }
            }
        }
    }
}
