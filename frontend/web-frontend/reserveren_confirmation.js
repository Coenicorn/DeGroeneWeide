const confirmButton = document.getElementById("confirm-btn");
const confirmationContainer = document.getElementById("confirm-container");

confirmButton.addEventListener("click", async () => {
    confirmationContainer.classList.toggle("hidden");
});

