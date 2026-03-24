
(function() {
    const initializeDashboard = () => {
        // 1. SELECTORS
        const jobContainer = document.querySelector('.job-posting-container');
        const openJobsCountH1 = document.querySelector('.open-jobs h1');
        const nameDisplay = document.querySelector('.username'); 
        const logoDisplay = document.querySelector('.user-profile img'); 

        // 2. AUTH & BRANDING
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const savedName = localStorage.getItem("userName") || sessionStorage.getItem("userName");
        const savedProfile = JSON.parse(localStorage.getItem("companyProfile_Full") || "{}");

        if (nameDisplay) nameDisplay.innerText = savedName || savedProfile.companyName || "Recruiter";
        if (logoDisplay && savedProfile.logo) {
            logoDisplay.src = savedProfile.logo;
            logoDisplay.style.objectFit = "cover";
        }

        // 3. RENDER JOBS
        const renderJobs = (jobs) => {
            if (!jobContainer) return;
            if (openJobsCountH1) openJobsCountH1.innerText = jobs.length;

            const header = jobContainer.querySelector('.job-posting-box1');
            jobContainer.innerHTML = '';
            if (header) jobContainer.appendChild(header);

            if (!jobs || jobs.length === 0) {
                jobContainer.innerHTML += `
                    <div class="job-posting-box">
                        <h5 style="width:100%; text-align:center; padding: 20px; color: #7f8c8d;">
                            No jobs found. Click "Post a Job" to get started!
                        </h5>
                    </div>`;
                return;
            }

            jobs.forEach(job => {
                const jobBox = document.createElement('div');
                jobBox.className = 'job-posting-box';
                const dateStr = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Just now';
                const appCount = job.applicationCount || (job.applications ? job.applications.length : 0);

                jobBox.innerHTML = `
                    <div>
                        <h5>${job.title || 'Untitled Role'}</h5>
                        <h5>${job.type || 'Full Time'} • Posted ${dateStr}</h5>
                    </div>
                    <div class="bx-check-circle"><i class="bx bx-check-circle"> Active</i></div>
                    <div>
                        <h5>
                            <img src="images/profile male icon.svg" class="double-profile-image-icon"> 
                            ${appCount} Applications
                        </h5>
                    </div>
                    <div class="application-box">
                        <button class="application-btn" onclick="location.href='candidateranking.html?id=${job._id || job.id}'">
                            <h5>View Applications</h5>
                        </button>
                        <i class="bx bx-dots-vertical-rounded"></i>
                        <div class="application-popup">
                            <button class="popup-btn" onclick="location.href='postajob.html?edit=${job._id || job.id}'">
                                <i class="bx bx-edit"></i> Edit Job
                            </button>
                            <button class="popup-btn" style="color: #e74c3c;" onclick="deleteJobHandler('${job._id || job.id}')">
                                <i class="bx bx-trash"></i> Delete Job
                            </button>
                        </div>
                    </div>
                `;
                jobContainer.appendChild(jobBox);
            });

            // Re-bind popup events
            document.querySelectorAll('.bx-dots-vertical-rounded').forEach(icon => {
                icon.onclick = (e) => {
                    e.stopPropagation();
                    const popup = e.currentTarget.nextElementSibling;
                    document.querySelectorAll('.application-popup').forEach(p => { if (p !== popup) p.style.display = 'none'; });
                    if (popup) popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
                };
            });
        };

        // 4. LOAD DATA
        const loadData = async () => {
            if (!token) return renderJobs([]);
            try {
                const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/jobs/my-jobs", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });
                const result = await response.json();
                renderJobs(result.data || result.jobs || (Array.isArray(result) ? result : []));
                
            } catch (err) {
                console.error("Fetch error:", err);
                const localData = JSON.parse(localStorage.getItem('my_local_jobs')) || [];
                renderJobs(localData);
            }
        };

        // Global click to close popups
        document.addEventListener('click', () => {
            document.querySelectorAll('.application-popup').forEach(p => p.style.display = 'none');
        });

        loadData();
    };

    // --- SAFETY CHECK: Wait for DOM ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDashboard);
    } else {
        initializeDashboard();
    }
})();

// 5. GLOBAL DELETE HANDLER
async function deleteJobHandler(jobId) {
    if(!confirm("Permanently delete this job?")) return;
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    try {
        const response = await fetch(`https://hire-dey-go-be.onrender.com/api/v1/jobs/${jobId}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}`, "accept": "*/*" }
        });

        if (response.ok) {
            alert("Deleted successfully.");
            location.reload();
        } else {
            alert("Delete failed. Check permissions.");
        }
    } catch (err) {
        console.error("Delete error:", err);
    }
}