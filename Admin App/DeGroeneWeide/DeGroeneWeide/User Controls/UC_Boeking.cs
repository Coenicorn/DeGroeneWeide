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

namespace DeGroeneWeide.User_Controls
{
    public partial class UC_Boeking : UserControl
    {
        public UC_Boeking()
        {
            InitializeComponent();
        }

        public void FillInfo(Booking booking, Customer customer)
        {
            lbl_Aankomst.Text = booking.StartDate.ToString("dd-MM-yyyy");
            lbl_Vertrek.Text = booking.EndDate.ToString("dd-MM-yyyy");
            lbl_AantalMensen.Text = booking.AmountPeople.ToString();
            string name = $"{customer.FirstName} {customer.MiddleName} {customer.LastName}";
            lbl_Naam.Text = name.Replace("  ", " ");
            lbl_Email.Text = customer.Email;
            lbl_Nummer.Text = customer.PhoneNumber;
            lbl_id.Text = booking.Id;
        }
    }
}
