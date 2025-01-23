using System.Windows.Forms;

namespace DeGroeneWeide.User_Controls
{
    partial class UC_BoekingsPagina
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(UC_BoekingsPagina));
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            container = new FlowLayoutPanel();
            btn_refresh = new Guna.UI2.WinForms.Guna2ImageButton();
            btn_add = new Guna.UI2.WinForms.Guna2ImageButton();
            SuspendLayout();
            // 
            // container
            // 
            container.Location = new Point(30, 80);
            container.Name = "container";
            container.Size = new Size(1860, 918);
            container.TabIndex = 0;
            // 
            // btn_refresh
            // 
            btn_refresh.CheckedState.ImageSize = new Size(64, 64);
            btn_refresh.HoverState.ImageSize = new Size(64, 64);
            btn_refresh.Image = (Image)resources.GetObject("btn_refresh.Image");
            btn_refresh.ImageOffset = new Point(0, 0);
            btn_refresh.ImageRotate = 0F;
            btn_refresh.Location = new Point(1830, 13);
            btn_refresh.Name = "btn_refresh";
            btn_refresh.PressedState.ImageSize = new Size(64, 64);
            btn_refresh.ShadowDecoration.CustomizableEdges = customizableEdges1;
            btn_refresh.Size = new Size(64, 54);
            btn_refresh.TabIndex = 4;
            btn_refresh.Click += btn_refresh_Click;
            // 
            // btn_add
            // 
            btn_add.CheckedState.ImageSize = new Size(64, 64);
            btn_add.HoverState.ImageSize = new Size(64, 64);
            btn_add.Image = (Image)resources.GetObject("btn_add.Image");
            btn_add.ImageOffset = new Point(0, 0);
            btn_add.ImageRotate = 0F;
            btn_add.Location = new Point(1760, 13);
            btn_add.Name = "btn_add";
            btn_add.PressedState.ImageSize = new Size(64, 64);
            btn_add.ShadowDecoration.CustomizableEdges = customizableEdges2;
            btn_add.Size = new Size(64, 54);
            btn_add.TabIndex = 5;
            btn_add.Click += btn_add_Click;
            // 
            // UC_BoekingsPagina
            // 
            BackColor = Color.FromArgb(224, 251, 226);
            Controls.Add(btn_add);
            Controls.Add(btn_refresh);
            Controls.Add(container);
            Name = "UC_BoekingsPagina";
            Size = new Size(1920, 998);
            ResumeLayout(false);
        }

        #endregion

        private FlowLayoutPanel container;
        private Guna.UI2.WinForms.Guna2ImageButton btn_refresh;
        private Guna.UI2.WinForms.Guna2ImageButton btn_add;
    }
}
