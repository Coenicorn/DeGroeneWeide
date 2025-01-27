namespace DeGroeneWeide.Forms
{
    partial class Edit_Reader
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            name = new Guna.UI2.WinForms.Guna2TextBox();
            gast = new Guna.UI2.WinForms.Guna2CheckBox();
            bezoeker = new Guna.UI2.WinForms.Guna2CheckBox();
            medewerker = new Guna.UI2.WinForms.Guna2CheckBox();
            administrator = new Guna.UI2.WinForms.Guna2CheckBox();
            btn_save = new Guna.UI2.WinForms.Guna2Button();
            label1 = new Label();
            SuspendLayout();
            // 
            // name
            // 
            name.CustomizableEdges = customizableEdges5;
            name.DefaultText = "";
            name.DisabledState.BorderColor = Color.FromArgb(208, 208, 208);
            name.DisabledState.FillColor = Color.FromArgb(226, 226, 226);
            name.DisabledState.ForeColor = Color.FromArgb(138, 138, 138);
            name.DisabledState.PlaceholderForeColor = Color.FromArgb(138, 138, 138);
            name.FocusedState.BorderColor = Color.FromArgb(94, 148, 255);
            name.Font = new Font("Segoe UI", 9F);
            name.HoverState.BorderColor = Color.FromArgb(94, 148, 255);
            name.Location = new Point(12, 26);
            name.Name = "name";
            name.PasswordChar = '\0';
            name.PlaceholderText = "";
            name.SelectedText = "";
            name.ShadowDecoration.CustomizableEdges = customizableEdges6;
            name.Size = new Size(174, 36);
            name.TabIndex = 0;
            // 
            // gast
            // 
            gast.AutoSize = true;
            gast.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            gast.CheckedState.BorderRadius = 0;
            gast.CheckedState.BorderThickness = 0;
            gast.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            gast.Location = new Point(23, 77);
            gast.Name = "gast";
            gast.Size = new Size(49, 19);
            gast.TabIndex = 1;
            gast.Text = "Gast";
            gast.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            gast.UncheckedState.BorderRadius = 0;
            gast.UncheckedState.BorderThickness = 0;
            gast.UncheckedState.FillColor = Color.FromArgb(125, 137, 149);
            // 
            // bezoeker
            // 
            bezoeker.AutoSize = true;
            bezoeker.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            bezoeker.CheckedState.BorderRadius = 0;
            bezoeker.CheckedState.BorderThickness = 0;
            bezoeker.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            bezoeker.Location = new Point(23, 102);
            bezoeker.Name = "bezoeker";
            bezoeker.Size = new Size(73, 19);
            bezoeker.TabIndex = 2;
            bezoeker.Text = "Bezoeker";
            bezoeker.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            bezoeker.UncheckedState.BorderRadius = 0;
            bezoeker.UncheckedState.BorderThickness = 0;
            bezoeker.UncheckedState.FillColor = Color.FromArgb(125, 137, 149);
            // 
            // medewerker
            // 
            medewerker.AutoSize = true;
            medewerker.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            medewerker.CheckedState.BorderRadius = 0;
            medewerker.CheckedState.BorderThickness = 0;
            medewerker.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            medewerker.Location = new Point(23, 127);
            medewerker.Name = "medewerker";
            medewerker.Size = new Size(91, 19);
            medewerker.TabIndex = 3;
            medewerker.Text = "Medewerker";
            medewerker.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            medewerker.UncheckedState.BorderRadius = 0;
            medewerker.UncheckedState.BorderThickness = 0;
            medewerker.UncheckedState.FillColor = Color.FromArgb(125, 137, 149);
            // 
            // administrator
            // 
            administrator.AutoSize = true;
            administrator.CheckedState.BorderColor = Color.FromArgb(94, 148, 255);
            administrator.CheckedState.BorderRadius = 0;
            administrator.CheckedState.BorderThickness = 0;
            administrator.CheckedState.FillColor = Color.FromArgb(94, 148, 255);
            administrator.Location = new Point(23, 152);
            administrator.Name = "administrator";
            administrator.Size = new Size(99, 19);
            administrator.TabIndex = 4;
            administrator.Text = "Administrator";
            administrator.UncheckedState.BorderColor = Color.FromArgb(125, 137, 149);
            administrator.UncheckedState.BorderRadius = 0;
            administrator.UncheckedState.BorderThickness = 0;
            administrator.UncheckedState.FillColor = Color.FromArgb(125, 137, 149);
            // 
            // btn_save
            // 
            btn_save.CustomizableEdges = customizableEdges7;
            btn_save.DisabledState.BorderColor = Color.DarkGray;
            btn_save.DisabledState.CustomBorderColor = Color.DarkGray;
            btn_save.DisabledState.FillColor = Color.FromArgb(169, 169, 169);
            btn_save.DisabledState.ForeColor = Color.FromArgb(141, 141, 141);
            btn_save.Font = new Font("Segoe UI", 9F);
            btn_save.ForeColor = Color.White;
            btn_save.Location = new Point(36, 188);
            btn_save.Name = "btn_save";
            btn_save.ShadowDecoration.CustomizableEdges = customizableEdges8;
            btn_save.Size = new Size(117, 41);
            btn_save.TabIndex = 5;
            btn_save.Text = "Opslaan";
            btn_save.Click += btn_save_Click;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Location = new Point(12, 8);
            label1.Name = "label1";
            label1.Size = new Size(113, 15);
            label1.TabIndex = 6;
            label1.Text = "Naam van de reader";
            // 
            // Edit_Reader
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(197, 243);
            Controls.Add(label1);
            Controls.Add(btn_save);
            Controls.Add(administrator);
            Controls.Add(medewerker);
            Controls.Add(bezoeker);
            Controls.Add(gast);
            Controls.Add(name);
            FormBorderStyle = FormBorderStyle.Fixed3D;
            MaximizeBox = false;
            MinimizeBox = false;
            Name = "Edit_Reader";
            Text = "Aanpassen";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Guna.UI2.WinForms.Guna2TextBox name;
        private Guna.UI2.WinForms.Guna2CheckBox gast;
        private Guna.UI2.WinForms.Guna2CheckBox bezoeker;
        private Guna.UI2.WinForms.Guna2CheckBox medewerker;
        private Guna.UI2.WinForms.Guna2CheckBox administrator;
        private Guna.UI2.WinForms.Guna2Button btn_save;
        private Label label1;
    }
}