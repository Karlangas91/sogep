document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".main-sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    // Revisar estado guardado en localStorage
    if (localStorage.getItem("sidebarCollapsed") === "true") {
        sidebar.classList.add("sidebar-collapsed");
        sidebarToggle.checked = false;
    } else {
        sidebarToggle.checked = true;
    }

    sidebarToggle.addEventListener("change", function () {
        if (this.checked) {
            sidebar.classList.remove("sidebar-collapsed");
            localStorage.setItem("sidebarCollapsed", "false");
        } else {
            sidebar.classList.add("sidebar-collapsed");
            localStorage.setItem("sidebarCollapsed", "true");
        }
    });
});
