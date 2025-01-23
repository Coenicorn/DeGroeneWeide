
namespace DeGroeneWeide.User_Controls
{
    partial class UC_Boeking
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(UC_Boeking));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            label4 = new Label();
            label5 = new Label();
            label6 = new Label();
            lbl_Aankomst = new Label();
            lbl_Vertrek = new Label();
            lbl_AantalMensen = new Label();
            lbl_Email = new Label();
            lbl_Naam = new Label();
            lbl_Nummer = new Label();
            lbl_id = new Label();
            label8 = new Label();
            btn_edit = new Guna.UI2.WinForms.Guna2ImageButton();
            SuspendLayout();
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label1.ForeColor = Color.FromArgb(26, 46, 28);
            label1.Location = new Point(15, 6);
            label1.Name = "label1";
            label1.Size = new Size(146, 36);
            label1.TabIndex = 0;
            label1.Text = "Aankomst:";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label2.ForeColor = Color.FromArgb(26, 46, 28);
            label2.Location = new Point(15, 50);
            label2.Name = "label2";
            label2.Size = new Size(95, 36);
            label2.TabIndex = 1;
            label2.Text = "Naam:";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label3.ForeColor = Color.FromArgb(26, 46, 28);
            label3.Location = new Point(550, 50);
            label3.Name = "label3";
            label3.Size = new Size(88, 36);
            label3.TabIndex = 3;
            label3.Text = "Email:";
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label4.ForeColor = Color.FromArgb(26, 46, 28);
            label4.Location = new Point(550, 6);
            label4.Name = "label4";
            label4.Size = new Size(112, 36);
            label4.TabIndex = 2;
            label4.Text = "Vertrek:";
            // 
            // label5
            // 
            label5.AutoSize = true;
            label5.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label5.ForeColor = Color.FromArgb(26, 46, 28);
            label5.Location = new Point(1265, 50);
            label5.Name = "label5";
            label5.Size = new Size(132, 36);
            label5.TabIndex = 5;
            label5.Text = "Nummer:";
            // 
            // label6
            // 
            label6.AutoSize = true;
            label6.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label6.ForeColor = Color.FromArgb(26, 46, 28);
            label6.Location = new Point(1265, 6);
            label6.Name = "label6";
            label6.Size = new Size(203, 36);
            label6.TabIndex = 4;
            label6.Text = "Aantal mensen:";
            // 
            // lbl_Aankomst
            // 
            lbl_Aankomst.AutoSize = true;
            lbl_Aankomst.Font = new Font("Segoe UI", 16F);
            lbl_Aankomst.Location = new Point(171, 12);
            lbl_Aankomst.Name = "lbl_Aankomst";
            lbl_Aankomst.Size = new Size(127, 30);
            lbl_Aankomst.TabIndex = 6;
            lbl_Aankomst.Text = "09-01-2025";
            // 
            // lbl_Vertrek
            // 
            lbl_Vertrek.AutoSize = true;
            lbl_Vertrek.Font = new Font("Segoe UI", 16F);
            lbl_Vertrek.Location = new Point(668, 10);
            lbl_Vertrek.Name = "lbl_Vertrek";
            lbl_Vertrek.Size = new Size(127, 30);
            lbl_Vertrek.TabIndex = 7;
            lbl_Vertrek.Text = "16-01-2025";
            // 
            // lbl_AantalMensen
            // 
            lbl_AantalMensen.AutoSize = true;
            lbl_AantalMensen.Font = new Font("Segoe UI", 16F);
            lbl_AantalMensen.Location = new Point(1474, 12);
            lbl_AantalMensen.Name = "lbl_AantalMensen";
            lbl_AantalMensen.Size = new Size(25, 30);
            lbl_AantalMensen.TabIndex = 8;
            lbl_AantalMensen.Text = "5";
            // 
            // lbl_Email
            // 
            lbl_Email.AutoSize = true;
            lbl_Email.Font = new Font("Segoe UI", 16F);
            lbl_Email.Location = new Point(644, 54);
            lbl_Email.Name = "lbl_Email";
            lbl_Email.Size = new Size(265, 30);
            lbl_Email.TabIndex = 9;
            lbl_Email.Text = "jurre.blankers@gmail.com";
            // 
            // lbl_Naam
            // 
            lbl_Naam.AutoSize = true;
            lbl_Naam.Font = new Font("Segoe UI", 16F);
            lbl_Naam.Location = new Point(116, 56);
            lbl_Naam.Name = "lbl_Naam";
            lbl_Naam.Size = new Size(148, 30);
            lbl_Naam.TabIndex = 10;
            lbl_Naam.Text = "Jurre Blankers";
            // 
            // lbl_Nummer
            // 
            lbl_Nummer.AutoSize = true;
            lbl_Nummer.Font = new Font("Segoe UI", 16F);
            lbl_Nummer.Location = new Point(1403, 56);
            lbl_Nummer.Name = "lbl_Nummer";
            lbl_Nummer.Size = new Size(142, 30);
            lbl_Nummer.TabIndex = 11;
            lbl_Nummer.Text = "06-12345678";
            // 
            // lbl_id
            // 
            lbl_id.AutoSize = true;
            lbl_id.Font = new Font("Segoe UI", 16F);
            lbl_id.Location = new Point(1650, 12);
            lbl_id.Name = "lbl_id";
            lbl_id.Size = new Size(121, 30);
            lbl_id.TabIndex = 13;
            lbl_id.Text = "123435345";
            // 
            // label8
            // 
            label8.AutoSize = true;
            label8.Font = new Font("Segoe UI", 19F, FontStyle.Bold, GraphicsUnit.Point, 0);
            label8.ForeColor = Color.FromArgb(26, 46, 28);
            label8.Location = new Point(1600, 6);
            label8.Name = "label8";
            label8.Size = new Size(46, 36);
            label8.TabIndex = 12;
            label8.Text = "Id:";
            // 
            // btn_edit
            // 
            btn_edit.CheckedState.ImageSize = new Size(64, 64);
            btn_edit.HoverState.ImageSize = new Size(26, 26);
            btn_edit.Image = (Image)resources.GetObject("btn_edit.Image");
            btn_edit.ImageOffset = new Point(0, 0);
            btn_edit.ImageRotate = 0F;
            btn_edit.ImageSize = new Size(24, 24);
            btn_edit.Location = new Point(1820, 12);
            btn_edit.Name = "btn_edit";
            btn_edit.PressedState.ImageSize = new Size(28, 28);
            btn_edit.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_edit.Size = new Size(24, 24);
            btn_edit.TabIndex = 14;
            btn_edit.Click += btn_edit_Click;
            // 
            // UC_Boeking
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            BackColor = Color.FromArgb(201, 234, 203);
            Controls.Add(btn_edit);
            Controls.Add(lbl_id);
            Controls.Add(label8);
            Controls.Add(lbl_Nummer);
            Controls.Add(lbl_Naam);
            Controls.Add(lbl_Email);
            Controls.Add(lbl_AantalMensen);
            Controls.Add(lbl_Vertrek);
            Controls.Add(lbl_Aankomst);
            Controls.Add(label5);
            Controls.Add(label6);
            Controls.Add(label3);
            Controls.Add(label4);
            Controls.Add(label2);
            Controls.Add(label1);
            Name = "UC_Boeking";
            Size = new Size(1860, 100);
            ResumeLayout(false);
            PerformLayout();
        }

        private void Label3_Click(object sender, EventArgs e)
        {
            throw new NotImplementedException();
        }

        #endregion

        private Label label1;
        private Label label2;
        private Label label3;
        private Label label4;
        private Label label5;
        private Label label6;
        private Label lbl_Aankomst;
        private Label lbl_Vertrek;
        private Label lbl_AantalMensen;
        private Label lbl_Email;
        private Label lbl_Naam;
        private Label lbl_Nummer;
        private Label lbl_id;
        private Label label8;
        private Guna.UI2.WinForms.Guna2ImageButton btn_edit;
    }
}
