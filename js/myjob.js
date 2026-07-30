document.addEventListener("DOMContentLoaded", function () {
    const jobListContainer = document.getElementById("jobListContainer");
    const token = localStorage.getItem("token");

    // Select the Stat H2 elements directly from the HTML
    const totalStat = document.querySelector(".stat:nth-child(1) h2");
    const activeStat = document.querySelector(".stat:nth-child(2) h2");
    const draftStat = document.querySelector(".stat:nth-child(3) h2");
    const expiredStat = document.querySelector(".stat:nth-child(4) h2");

    async function fetchMyJobs() {
        if (!token) return;

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs/my-jobs", {
                headers: {
                    "Authorization": `Bearer ${token.trim()}`,
                    "Accept": "application/json"
                }
            });

            const result = await response.json();
            const jobs = result.data || result;
            
            console.log("Inspecting first job data:", jobs[0]); // Look at this in F12 console!
            
            renderJobs(jobs);
            updateDashboardStats(jobs);

        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    function renderJobs(jobs) {
        if (!jobListContainer) return;
        jobListContainer.innerHTML = "";

        jobs.forEach(job => {
            const card = document.createElement("div");
            card.className = "job-card";
            
            // Try every possible field name for applicants
            const appliedCount = job.applications_count ?? 
                                 job.applicants_count ?? 
                                 (job.applications ? job.applications.length : 0);

            card.innerHTML = `
                <div class="job-left">
                    <h3>${job.title}</h3>
                    <p>${job.location || 'Remote'} • ${job.type || 'Full-time'}</p>
                    <span class="status ${job.status?.toLowerCase()}">${job.status}</span>
                </div>
                <div class="jobs">
                    <div class="job-stats">
                        <p><b>${appliedCount}</b><br>Applied</p>
                        <p><b>${job.shortlisted_count || 0}</b><br>Shortlisted</p>
                    </div>
                    <div class="job-actions">
                        <button class="view" onclick="window.location.href='applications.html?id=${job.id}'">View</button>
                        <button class="close-btn" data-id="${job.id}">Close</button>
                        <button class="delete-btn" data-id="${job.id}" style="color:red; background:none; border:1px solid red; font-size:12px;">Delete</button>
                    </div>
                </div>`;
            jobListContainer.appendChild(card);
        });
    }

    /* =========================
       DYNAMIC STATS UPDATE
    ========================== */
    function updateDashboardStats(jobs) {
        let active = 0, draft = 0, expired = 0;

        jobs.forEach(job => {
            const status = job.status?.toLowerCase();
            if (status === "active") active++;
            else if (status === "draft") draft++;
            else if (status === "closed" || status === "expired") expired++;
        });

        // Update the HTML numbers
        if (totalStat) totalStat.textContent = jobs.length;
        if (activeStat) activeStat.textContent = active;
        if (draftStat) draftStat.textContent = draft;
        if (expiredStat) expiredStat.textContent = expired;
    }

    /* =========================
       ACTIONS (CLOSE & DELETE)
    ========================== */
    document.addEventListener("click", async (e) => {
        const jobId = e.target.dataset.id;
        if (!jobId) return;

        // CLOSE JOB
        if (e.target.classList.contains("close-btn")) {
            if (confirm("Close this job post?")) {
                const res = await fetch(`https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs/${jobId}/close`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) fetchMyJobs();
            }
        }

        // DELETE JOB
        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Delete this job post permanently?")) {
                const res = await fetch(`https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs/${jobId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) fetchMyJobs();
            }
        }
    });

    fetchMyJobs();
});