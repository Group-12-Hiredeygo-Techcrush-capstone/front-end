document.addEventListener('DOMContentLoaded', () => {
    // 1. SELECTORS
    const jobContainer = document.querySelector('.job-posting-container');
    const openJobsCountH1 = document.querySelector('.open-jobs h1');
    const nameDisplay = document.querySelector('.username'); 
    const logoDisplay = document.querySelector('.user-profile img'); // Target your header logo

    // 2. LOAD BRANDING (From Profile Setup)
    const savedProfile = JSON.parse(localStorage.getItem("companyProfile_Full"));
    const registrationName = localStorage.getItem("company_name");

    if (savedProfile) {
        if (nameDisplay) nameDisplay.innerText = savedProfile.companyName || registrationName || "Recruiter";
        if (logoDisplay && savedProfile.logo) {
            logoDisplay.src = savedProfile.logo;
            logoDisplay.style.objectFit = "cover";
        }
    } else if (registrationName && nameDisplay) {
        nameDisplay.innerText = registrationName;
    }

    // 3. RENDER JOBS LOGIC
    const renderJobs = (jobs) => {
        if (!jobContainer) return;

        // Update total job count display
        if (openJobsCountH1) openJobsCountH1.innerText = jobs.length;

        // Preserve Header (job-posting-box1), clear the rest
        const header = jobContainer.querySelector('.job-posting-box1');
        jobContainer.innerHTML = '';
        if (header) jobContainer.appendChild(header);

        if (jobs.length === 0) {
            jobContainer.innerHTML += `
                <div class="job-posting-box">
                    <h5 style="width:100%; text-align:center; padding: 20px;">
                        No jobs found. Post a job to see it here!
                    </h5>
                </div>`;
            return;
        }

        jobs.forEach(job => {
            const jobBox = document.createElement('div');
            jobBox.className = 'job-posting-box';
            
            jobBox.innerHTML = `
                <div>
                    <h5>${job.title || job.jobTitle || 'Untitled Job'}</h5>
                    <h5>${job.jobType || 'Full Time'} • ${job.postedAt || 'Just now'}</h5>
                </div>
                <div class="bx-check-circle"><i class="bx bx-check-circle"> Active</i></div>
                <div>
                    <h5>
                        <img src="images/profile male icon.svg" class="double-profile-image-icon"> 
                        ${job.applicationCount || 0} Applications
                    </h5>
                </div>
                <div class="application-box">
                    <button class="application-btn" onclick="location.href='candidateranking.html?id=${job._id || job.id}'">
                        <h5>View Applications</h5>
                    </button>
                    <i class="bx bx-dots-vertical-rounded"></i>
                    <div class="application-popup">
                        <button class="popup-btn"><i class="bx bx-show"></i> View Details</button>
                        <button class="popup-btn"><i class="bx bx-edit"></i> Edit Job</button>
                        <button class="popup-btn" style="color: red;" onclick="deleteLocalJob('${job._id || job.id}')">
                            <i class="bx bx-trash"></i> Delete Job
                        </button>
                    </div>
                </div>
            `;
            jobContainer.appendChild(jobBox);
        });

        initPopupLogic();
    };

    const initPopupLogic = () => {
        const dotsIcons = document.querySelectorAll('.bx-dots-vertical-rounded');
        dotsIcons.forEach(icon => {
            icon.onclick = (e) => {
                e.stopPropagation();
                const popup = e.currentTarget.nextElementSibling;
                if (popup) {
                    document.querySelectorAll('.application-popup').forEach(p => {
                        if (p !== popup) p.style.display = 'none';
                    });
                    const isVisible = popup.style.display === 'flex';
                    popup.style.display = isVisible ? 'none' : 'flex';
                }
            };
        });
    };

    // 4. LOAD DATA (API + LOCAL)
    const loadDashboard = async () => {
        let allJobs = [];

        // Pull Local Storage
        const localData = localStorage.getItem('my_local_jobs');
        if (localData) {
            allJobs = JSON.parse(localData);
        }

        // Try API (Updated token key to match registration.js)
        const token = localStorage.getItem('auth_token'); 
        
        if (token && token !== "test_mode_token_123") {
            try {
                const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs/my-jobs", {
                    method: "GET",
                    headers: { 
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json" 
                    }
                });
                const result = await response.json();
                const apiJobs = result.data || result.jobs || [];
                
                // Merge without duplicates (by title)
                const apiTitles = apiJobs.map(j => j.title);
                allJobs = [...apiJobs, ...allJobs.filter(j => !apiTitles.includes(j.title))];
            } catch (err) {
                console.warn("Backend offline, using local data.");
            }
        }

        renderJobs(allJobs);
    };

    // Close popups on click outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.application-popup').forEach(p => p.style.display = 'none');
    });

    loadDashboard();
});

// 5. GLOBAL HELPERS
function deleteLocalJob(id) {
    if(confirm("Delete this job listing?")) {
        let localJobs = JSON.parse(localStorage.getItem('my_local_jobs')) || [];
        localJobs = localJobs.filter(j => (j._id || j.id) !== id);
        localStorage.setItem('my_local_jobs', JSON.stringify(localJobs));
        location.reload();
    }
}