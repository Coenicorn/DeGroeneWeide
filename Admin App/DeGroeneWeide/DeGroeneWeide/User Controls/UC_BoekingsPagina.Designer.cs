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
            container = new FlowLayoutPanel();
            SuspendLayout();
            // 
            // container
            // 
            container.Location = new Point(30, 80);
            container.Name = "container";
            container.Size = new Size(1860, 918);
            container.TabIndex = 0;
            // 
            // UC_BoekingsPagina
            // 
            Controls.Add(container);
            Name = "UC_BoekingsPagina";
            Size = new Size(1920, 998);
            ResumeLayout(false);
        }

        #endregion

        private FlowLayoutPanel container;
    }
}
