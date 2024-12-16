namespace DeGroeneWeide
{
    partial class UC_PasjesPagina
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(UC_PasjesPagina));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            cards_container = new FlowLayoutPanel();
            btn_plus = new Guna.UI2.WinForms.Guna2ImageButton();
            guna2ImageButton2 = new Guna.UI2.WinForms.Guna2ImageButton();
            guna2ImageButton3 = new Guna.UI2.WinForms.Guna2ImageButton();
            addCard = new Guna.UI2.WinForms.Guna2Panel();
            Btn_close_AddCard = new Guna.UI2.WinForms.Guna2ImageButton();
            Lbl_Card_Found = new Guna.UI2.WinForms.Guna2HtmlLabel();
            Btn_AddCard = new Guna.UI2.WinForms.Guna2Button();
            addCard.SuspendLayout();
            SuspendLayout();
            // 
            // cards_container
            // 
            cards_container.AutoScroll = true;
            cards_container.BackColor = Color.Transparent;
            cards_container.Location = new Point(31, 82);
            cards_container.Name = "cards_container";
            cards_container.Size = new Size(1872, 920);
            cards_container.TabIndex = 1;
            // 
            // btn_plus
            // 
            btn_plus.CheckedState.ImageSize = new Size(64, 64);
            btn_plus.HoverState.Image = Properties.Resources.plus_icon_hover;
            btn_plus.HoverState.ImageSize = new Size(50, 50);
            btn_plus.Image = Properties.Resources.plus_icon_default;
            btn_plus.ImageOffset = new Point(0, 0);
            btn_plus.ImageRotate = 0F;
            btn_plus.ImageSize = new Size(50, 50);
            btn_plus.Location = new Point(1839, 13);
            btn_plus.Name = "btn_plus";
            btn_plus.PressedState.Image = Properties.Resources.plus_icon_click;
            btn_plus.PressedState.ImageSize = new Size(50, 50);
            btn_plus.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_plus.Size = new Size(64, 54);
            btn_plus.TabIndex = 2;
            btn_plus.Click += Btn_plus_Click;
            // 
            // guna2ImageButton2
            // 
            guna2ImageButton2.CheckedState.ImageSize = new Size(64, 64);
            guna2ImageButton2.HoverState.ImageSize = new Size(50, 50);
            guna2ImageButton2.Image = Properties.Resources.filter_icon;
            guna2ImageButton2.ImageOffset = new Point(0, 0);
            guna2ImageButton2.ImageRotate = 0F;
            guna2ImageButton2.ImageSize = new Size(50, 50);
            guna2ImageButton2.Location = new Point(1699, 13);
            guna2ImageButton2.Name = "guna2ImageButton2";
            guna2ImageButton2.PressedState.ImageSize = new Size(50, 50);
            guna2ImageButton2.ShadowDecoration.CustomizableEdges = customizableEdges2;
            guna2ImageButton2.Size = new Size(64, 54);
            guna2ImageButton2.TabIndex = 3;
            // 
            // guna2ImageButton3
            // 
            guna2ImageButton3.CheckedState.ImageSize = new Size(64, 64);
            guna2ImageButton3.HoverState.ImageSize = new Size(100, 100);
            guna2ImageButton3.Image = Properties.Resources.search_icon;
            guna2ImageButton3.ImageOffset = new Point(0, 0);
            guna2ImageButton3.ImageRotate = 0F;
            guna2ImageButton3.ImageSize = new Size(100, 100);
            guna2ImageButton3.Location = new Point(1769, 13);
            guna2ImageButton3.Name = "guna2ImageButton3";
            guna2ImageButton3.PressedState.ImageSize = new Size(100, 100);
            guna2ImageButton3.ShadowDecoration.CustomizableEdges = customizableEdges3;
            guna2ImageButton3.Size = new Size(64, 54);
            guna2ImageButton3.TabIndex = 4;
            // 
            // addCard
            // 
            addCard.BackColor = Color.Transparent;
            addCard.BorderRadius = 15;
            addCard.Controls.Add(Btn_AddCard);
            addCard.Controls.Add(Lbl_Card_Found);
            addCard.Controls.Add(Btn_close_AddCard);
            addCard.CustomizableEdges = customizableEdges7;
            addCard.FillColor = Color.White;
            addCard.Location = new Point(660, 45);
            addCard.Name = "addCard";
            addCard.ShadowDecoration.CustomizableEdges = customizableEdges8;
            addCard.Size = new Size(600, 800);
            addCard.TabIndex = 5;
            addCard.Visible = false;
            // 
            // Btn_close_AddCard
            // 
            Btn_close_AddCard.CheckedState.ImageSize = new Size(64, 64);
            Btn_close_AddCard.HoverState.ImageSize = new Size(64, 64);
            Btn_close_AddCard.Image = (Image)resources.GetObject("Btn_close_AddCard.Image");
            Btn_close_AddCard.ImageOffset = new Point(0, 0);
            Btn_close_AddCard.ImageRotate = 0F;
            Btn_close_AddCard.Location = new Point(533, 3);
            Btn_close_AddCard.Name = "Btn_close_AddCard";
            Btn_close_AddCard.PressedState.ImageSize = new Size(64, 64);
            Btn_close_AddCard.ShadowDecoration.CustomizableEdges = customizableEdges6;
            Btn_close_AddCard.Size = new Size(64, 54);
            Btn_close_AddCard.TabIndex = 0;
            Btn_close_AddCard.Click += Btn_close_AddCard_Click;
            // 
            // Lbl_Card_Found
            // 
            Lbl_Card_Found.AutoSize = false;
            Lbl_Card_Found.BackColor = Color.Transparent;
            Lbl_Card_Found.Location = new Point(145, 37);
            Lbl_Card_Found.Name = "Lbl_Card_Found";
            Lbl_Card_Found.Size = new Size(302, 61);
            Lbl_Card_Found.TabIndex = 0;
            Lbl_Card_Found.TabStop = false;
            Lbl_Card_Found.Text = "Pasje gevonden";
            Lbl_Card_Found.TextAlignment = ContentAlignment.MiddleCenter;
            // 
            // Btn_AddCard
            // 
            Btn_AddCard.CustomizableEdges = customizableEdges4;
            Btn_AddCard.DisabledState.BorderColor = Color.DarkGray;
            Btn_AddCard.DisabledState.CustomBorderColor = Color.DarkGray;
            Btn_AddCard.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            Btn_AddCard.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            Btn_AddCard.Font = new Font("Segoe UI", 9F);
            Btn_AddCard.ForeColor = Color.White;
            Btn_AddCard.Location = new Point(197, 735);
            Btn_AddCard.Name = "Btn_AddCard";
            Btn_AddCard.ShadowDecoration.CustomizableEdges = customizableEdges5;
            Btn_AddCard.Size = new Size(206, 45);
            Btn_AddCard.TabIndex = 1;
            Btn_AddCard.Text = "guna2Button1";
            Btn_AddCard.Click += Btn_AddCard_Click;
            // 
            // UC_PasjesPagina
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.Transparent;
            Controls.Add(addCard);
            Controls.Add(guna2ImageButton3);
            Controls.Add(guna2ImageButton2);
            Controls.Add(btn_plus);
            Controls.Add(cards_container);
            Margin = new Padding(2);
            Name = "UC_PasjesPagina";
            Size = new Size(1920, 998);
            addCard.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion
        private FlowLayoutPanel cards_container;
        private Guna.UI2.WinForms.Guna2ImageButton btn_plus;
        private Guna.UI2.WinForms.Guna2ImageButton guna2ImageButton2;
        private Guna.UI2.WinForms.Guna2ImageButton guna2ImageButton3;
        private Guna.UI2.WinForms.Guna2Panel addCard;
        private Guna.UI2.WinForms.Guna2HtmlLabel Lbl_Card_Found;
        private Guna.UI2.WinForms.Guna2ImageButton Btn_close_AddCard;
        private Guna.UI2.WinForms.Guna2Button Btn_AddCard;
    }
}
