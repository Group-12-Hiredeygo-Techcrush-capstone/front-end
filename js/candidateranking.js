/**
 * HireDeyGo | Candidate Ranking & Assessment Switcher
 * Flow: 
 * 1. Fetch All Jobs -> 2. Filter for 'ACTIVE' -> 3. Fetch Rankings for Selected Job
 */

document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
    const tableBody = document.getElementById("tableBody");
    const sortSelect = document.getElementById("sortSelect");
    const jobTitleDisplay = document.querySelector(".assessment-test2 h2");
    
    let candidates = []; // Holds the current job's candidates
    let allJobs = [];    // Holds all jobs for navigation
    let currentJobIndex = 0;

    // --- 1. TOKEN HELPER ---
    const getCleanToken = () => {
        const token = localStorage.getItem("token") || localStorage.getItem("HireDeyGo_UserPlanStarterauth_token");
        if (!token) return null;
        try {
            const parsed = JSON.parse(token);
            return (parsed.tokens?.accessToken || parsed.token || token).replace(/"/g, "").replace(/Bearer /g, "").trim();
        } catch (e) {
            return token.replace(/"/g, "").replace(/Bearer /g, "").trim();
        }
    };

    // --- 2. FETCH RANKINGS FOR SPECIFIC JOB ---
    async function fetchRankings(jobId) {
        const cleanToken = getCleanToken();
        if (!jobId || !cleanToken) return;

        try {
            tableBody.innerHTML = '<div style="padding: 20px;">Loading candidates...</div>';
            
            const response = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}/rankings`, {
                headers: { 'Authorization': `Bearer ${cleanToken}` }
            });
            const result = await response.json();
            
            const apiData = result.data || result.rankings || result.results || [];

            candidates = apiData.map(item => ({
                name: item.user?.name || "Unknown Candidate",
                email: item.user?.email || "N/A",
                score: item.score || 0,
                time: item.timeTaken || "0 min",
                correct: item.correctAnswers || "0/0",
                result: item.score >= 60 ? "Passed" : "Failed"
            }));

            renderTable(candidates);
            updateStatCards(candidates);
        } catch (err) {
            console.error("Fetch Rankings Error:", err);
            tableBody.innerHTML = '<div style="padding: 20px; color: red;">Failed to load candidate data.</div>';
        }
    }

    // --- 3. FETCH ALL JOBS (FILTERED & CASE-INSENSITIVE) ---
    async function initJobSwitcher() {
        const cleanToken = getCleanToken();
        if (!cleanToken) {
            console.error("No token found. Please login.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/v1/jobs`, {
                headers: { 'Authorization': `Bearer ${cleanToken}` }
            });
            const result = await response.json();
            const rawJobs = result.data || [];

            // Case-insensitive filter: Matches 'ACTIVE', 'active', 'published', etc.
            allJobs = rawJobs.filter(job => {
                const status = (job.status || "").toLowerCase();
                return status === 'active' || status === 'published' || status === 'open';
            });

            const savedJobId = localStorage.getItem("last_created_job_id");
            currentJobIndex = allJobs.findIndex(j => (j._id === savedJobId || j.id === savedJobId));
            
            if (currentJobIndex === -1) currentJobIndex = 0;

            if (allJobs.length > 0) {
                updateJobUI(allJobs[currentJobIndex]);
            } else {
                if (jobTitleDisplay) jobTitleDisplay.innerText = "No Active Assessments";
                tableBody.innerHTML = '<div style="padding: 40px; text-align: center;">No active jobs found for this company.</div>';
            }
        } catch (err) {
            console.error("Job Switcher Error:", err);
        }
    }

    // --- 4. NAVIGATION LOGIC ---
    window.switchJob = (direction) => {
        if (allJobs.length === 0) return;

        if (direction === 'next' && currentJobIndex < allJobs.length - 1) {
            currentJobIndex++;
        } else if (direction === 'prev' && currentJobIndex > 0) {
            currentJobIndex--;
        } else {
            return; 
        }

        const selectedJob = allJobs[currentJobIndex];
        localStorage.setItem("last_created_job_id", selectedJob._id || selectedJob.id);
        updateJobUI(selectedJob);
    };

    function updateJobUI(job) {
        if (jobTitleDisplay) jobTitleDisplay.innerText = job.title || job.name;
        
        // Metadata mapping - Fixed the hardcoded 45 min bug
        const metaContainer = document.querySelector('.assessment-test3');
        if (metaContainer) {
            // Priority: job.duration -> assessment.timeLimit -> default 10
            const displayDuration = job.duration || (job.assessment && job.assessment.timeLimit) || '10';
            
            metaContainer.innerHTML = `
                <div><i class='bx bx-briefcase'></i> ${job.category || 'Professional'}</div>
                <div><i class='bx bx-group'></i> Job ${currentJobIndex + 1} of ${allJobs.length}</div>
                <div><i class='bx bx-time-five'></i> ${displayDuration} min</div>
                <div><i class='bx bx-calendar'></i> ${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</div>
            `;
        }
        
        fetchRankings(job._id || job.id);
    }

    // --- 5. STATS UPDATE ---
    function updateStatCards(data) {
        const total = data.length;
        const passed = data.filter(c => c.result === "Passed").length;
        const avg = total > 0 ? Math.round(data.reduce((a, b) => a + b.score, 0) / total) : 0;

        const statHeads = document.querySelectorAll('.rank-candidate-box h1');
        if (statHeads.length >= 3) {
            statHeads[0].innerText = total;
            statHeads[1].innerText = passed;
            statHeads[2].innerText = `${avg}%`;
        }
        
        const footerSpan = document.querySelector('.footer span');
        if (footerSpan) footerSpan.innerText = `Showing ${total} candidates`;
    }

    // --- 6. TABLE RENDER LOGIC ---
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `
                <div style="padding: 60px; text-align: center; color: #888; width: 100%;">
                    <i class='bx bx-user-voice' style="font-size: 3rem; opacity: 0.3;"></i>
                    <p>No candidates have completed this test yet.</p>
                </div>`;
            return;
        }

        data.forEach((c, index) => {
            const row = document.createElement("div");
            row.className = "row";
            row.innerHTML = `
                <span>${index + 1}</span>
                <span>
                    <strong>${c.name}</strong><br/>
                    <small style="color: #666;">${c.email}</small>
                </span>
                <span>
                    ${c.score}%
                    <div class="progress">
                        <span style="width:${c.score}%"></span>
                    </div>
                </span>
                <span>${c.time}</span>
                <span>${c.correct}</span>
                <span>
                    <span class="status ${c.result.toLowerCase()}">${c.result}</span>
                </span>
                <span>
                    <button class="btn primary">View Profile</button>
                    ${c.result === "Failed" 
                        ? '<button class="btn danger">Message</button>' 
                        : '<button class="btn secondary">Save</button>'}
                </span>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- 7. SORTING LOGIC ---
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            if (candidates.length === 0) return;
            let sorted = [...candidates];
            if (sortSelect.value === "high") {
                sorted.sort((a, b) => b.score - a.score);
            } else {
                sorted.sort((a, b) => a.score - b.score);
            }
            renderTable(sorted);
        });
    }

    initJobSwitcher();
});