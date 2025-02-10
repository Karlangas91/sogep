document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleSidebar");
    const body = document.body;

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            body.classList.toggle("sidebar-collapse");
        });
    }
});
