document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const body = document.body;

    // Revisar si hay preferencia guardada
    if (localStorage.getItem("sidebarFixed") === "true") {
        sidebarToggle.checked = true;
        body.classList.add("sidebar-collapse");
    }

    sidebarToggle.addEventListener("change", function () {
        if (this.checked) {
            body.classList.add("sidebar-collapse");
            localStorage.setItem("sidebarFixed", "true");
        } else {
            body.classList.remove("sidebar-collapse");
            localStorage.setItem("sidebarFixed", "false");
        }
    });
});
