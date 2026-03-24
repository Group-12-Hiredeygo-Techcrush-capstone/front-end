document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       SIDEBAR ACTIVE SWITCH
    ========================== */
    const sidebarItems = document.querySelectorAll(".sidebar li");

    sidebarItems.forEach(item => {
        item.addEventListener("click", function () {
            sidebarItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });


    /* =========================
       SEARCH FUNCTIONALITY
    ========================== */
    const searchInput = document.querySelector(".search-row input");
    const jobCards = document.querySelectorAll(".job-card");

    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();

        jobCards.forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();

            if (title.includes(value)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    });


    /* =========================
       BUTTON ACTIONS
    ========================== */

    // CLOSE JOB
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest(".job-card");

            if (confirm("Are you sure you want to close this job?")) {
                card.querySelector(".status").textContent = "Closed";
                card.querySelector(".status").className = "status expired";
            }
        });
    });

    // EDIT
    document.querySelectorAll(".edit").forEach(btn => {
        btn.addEventListener("click", function () {
            alert("Redirecting to edit page...");
        });
    });

    // VIEW APPLICATIONS
    document.querySelectorAll(".view").forEach(btn => {
        btn.addEventListener("click", function () {
            alert("Opening applications...");
        });
    });

    // PUBLISH
    document.querySelectorAll(".publish").forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest(".job-card");
            const status = card.querySelector(".status");

            status.textContent = "Active";
            status.className = "status active";

            alert("Job Published Successfully!");
        });
    });

    // REPOST
    document.querySelectorAll(".repost").forEach(btn => {
        btn.addEventListener("click", function () {
            const card = this.closest(".job-card");
            const status = card.querySelector(".status");

            status.textContent = "Active";
            status.className = "status active";

            alert("Job Reposted Successfully!");
        });
    });


    /* =========================
       STATS AUTO UPDATE
    ========================== */
    function updateStats() {
        let active = 0;
        let draft = 0;
        let expired = 0;

        document.querySelectorAll(".job-card").forEach(card => {
            const status = card.querySelector(".status").textContent.toLowerCase();

            if (status.includes("active")) active++;
            else if (status.includes("draft")) draft++;
            else expired++;
        });

        const statBoxes = document.querySelectorAll(".stat");

        statBoxes[1].querySelector("h2").textContent = active;
        statBoxes[2].querySelector("h2").textContent = draft;
        statBoxes[3].querySelector("h2").textContent = expired;
    }

    // Run initially
    updateStats();


    /* =========================
       DROPDOWN / PROFILE CLICK (optional)
    ========================== */
    const avatar = document.querySelector(".avatar");

    if (avatar) {
        avatar.addEventListener("click", () => {
            alert("Open profile menu");
        });
    }

});