namespace DeGroeneWeide.Forms
{
    partial class Edit_Card
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

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            combox_boekingen = new ComboBox();
            label1 = new Label();
            btn_gast = new Guna.UI2.WinForms.Guna2RadioButton();
            btn_bezoeker = new Guna.UI2.WinForms.Guna2RadioButton();
            btn_medewerker = new Guna.UI2.WinForms.Guna2RadioButton();
            btn_admin = new Guna.UI2.WinForms.Guna2RadioButton();
            label2 = new Label();
            btn_save = new Guna.UI2.WinForms.Guna2Button();
            btn_none = new Guna.UI2.WinForms.Guna2RadioButton();
            SuspendLayout();
            // 
            // combox_boekingen
            // 
            combox_boekingen.FormattingEnabled = true;
            combox_boekingen.Location = new Point(12, 29);
            combox_boekingen.Name = "combox_boekingen";
            combox_boekingen.Size = new Size(186, 23);
            combox_boekingen.TabIndex = 0;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(12, 9);
            label1.Name = "label1";
            label1.Size = new Size(50, 15);
            label1.TabIndex = 1;
            label1.Text = "Boeking";
            // 
            // btn_gast
            // 
            btn_gast.AutoSize = true;
            btn_gast.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            btn_gast.CheckedState.BorderThickness = 0;
            btn_gast.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            btn_gast.CheckedState.InnerColor = Color.White;
            btn_gast.CheckedState.InnerOffset = -4;
            btn_gast.Location = new Point(21, 99);
            btn_gast.Name = "btn_gast";
            btn_gast.Size = new Size(47, 19);
            btn_gast.TabIndex = 2;
            btn_gast.Text = "gast";
            btn_gast.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            btn_gast.UncheckedState.BorderThickness = 2;
            btn_gast.UncheckedState.FillColor = Color.Transparent;
            btn_gast.UncheckedState.InnerColor = Color.Transparent;
            // 
            // btn_bezoeker
            // 
            btn_bezoeker.AutoSize = true;
            btn_bezoeker.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            btn_bezoeker.CheckedState.BorderThickness = 0;
            btn_bezoeker.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            btn_bezoeker.CheckedState.InnerColor = Color.White;
            btn_bezoeker.CheckedState.InnerOffset = -4;
            btn_bezoeker.Location = new Point(21, 124);
            btn_bezoeker.Name = "btn_bezoeker";
            btn_bezoeker.Size = new Size(72, 19);
            btn_bezoeker.TabIndex = 3;
            btn_bezoeker.Text = "bezoeker";
            btn_bezoeker.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            btn_bezoeker.UncheckedState.BorderThickness = 2;
            btn_bezoeker.UncheckedState.FillColor = Color.Transparent;
            btn_bezoeker.UncheckedState.InnerColor = Color.Transparent;
            // 
            // btn_medewerker
            // 
            btn_medewerker.AutoSize = true;
            btn_medewerker.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            btn_medewerker.CheckedState.BorderThickness = 0;
            btn_medewerker.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            btn_medewerker.CheckedState.InnerColor = Color.White;
            btn_medewerker.CheckedState.InnerOffset = -4;
            btn_medewerker.Location = new Point(21, 149);
            btn_medewerker.Name = "btn_medewerker";
            btn_medewerker.Size = new Size(90, 19);
            btn_medewerker.TabIndex = 4;
            btn_medewerker.Text = "medewerker";
            btn_medewerker.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            btn_medewerker.UncheckedState.BorderThickness = 2;
            btn_medewerker.UncheckedState.FillColor = Color.Transparent;
            btn_medewerker.UncheckedState.InnerColor = Color.Transparent;
            // 
            // btn_admin
            // 
            btn_admin.AutoSize = true;
            btn_admin.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            btn_admin.CheckedState.BorderThickness = 0;
            btn_admin.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            btn_admin.CheckedState.InnerColor = Color.White;
            btn_admin.CheckedState.InnerOffset = -4;
            btn_admin.Location = new Point(21, 174);
            btn_admin.Name = "btn_admin";
            btn_admin.Size = new Size(59, 19);
            btn_admin.TabIndex = 5;
            btn_admin.Text = "admin";
            btn_admin.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            btn_admin.UncheckedState.BorderThickness = 2;
            btn_admin.UncheckedState.FillColor = Color.Transparent;
            btn_admin.UncheckedState.InnerColor = Color.Transparent;
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Location = new Point(12, 81);
            label2.Name = "label2";
            label2.Size = new Size(105, 15);
            label2.TabIndex = 6;
            label2.Text = "Authenticatie level";
            // 
            // btn_save
            // 
            btn_save.CustomizableEdges = customizableEdges1;
            btn_save.DisabledState.BorderColor = Color.DarkGray;
            btn_save.DisabledState.CustomBorderColor = Color.DarkGray;
            btn_save.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btn_save.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btn_save.Font = new Font("Segoe UI", 9F);
            btn_save.ForeColor = Color.White;
            btn_save.Location = new Point(12, 233);
            btn_save.Name = "btn_save";
            btn_save.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btn_save.Size = new Size(186, 45);
            btn_save.TabIndex = 7;
            btn_save.Text = "opslaan";
            btn_save.Click += btn_save_Click;
            // 
            // btn_none
            // 
            btn_none.AutoSize = true;
            btn_none.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            btn_none.CheckedState.BorderThickness = 0;
            btn_none.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            btn_none.CheckedState.InnerColor = Color.White;
            btn_none.CheckedState.InnerOffset = -4;
            btn_none.Location = new Point(21, 199);
            btn_none.Name = "btn_none";
            btn_none.Size = new Size(51, 19);
            btn_none.TabIndex = 8;
            btn_none.Text = "geen";
            btn_none.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            btn_none.UncheckedState.BorderThickness = 2;
            btn_none.UncheckedState.FillColor = Color.Transparent;
            btn_none.UncheckedState.InnerColor = Color.Transparent;
            // 
            // Edit_Card
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(210, 290);
            Controls.Add(btn_none);
            Controls.Add(btn_save);
            Controls.Add(label2);
            Controls.Add(btn_admin);
            Controls.Add(btn_medewerker);
            Controls.Add(btn_bezoeker);
            Controls.Add(btn_gast);
            Controls.Add(label1);
            Controls.Add(combox_boekingen);
            Name = "Edit_Card";
            Text = "Edit_Card";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private ComboBox combox_boekingen;
        private Label label1;
        private Guna.UI2.WinForms.Guna2RadioButton btn_gast;
        private Guna.UI2.WinForms.Guna2RadioButton btn_bezoeker;
        private Guna.UI2.WinForms.Guna2RadioButton btn_medewerker;
        private Guna.UI2.WinForms.Guna2RadioButton btn_admin;
        private Label label2;
        private Guna.UI2.WinForms.Guna2Button btn_save;
        private Guna.UI2.WinForms.Guna2RadioButton btn_none;
    }
}