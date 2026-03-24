/**
 * HireDeyGo | Candidate Ranking & Assessment Switcher
 * Fully compatible with Nested Data Structure (Ranked vs. Excluded)
 */

document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
    const tableBody = document.getElementById("tableBody");
    const sortSelect = document.getElementById("sortSelect");
    const jobTitleDisplay = document.querySelector(".assessment-test2 h2");
    
    let candidates = []; 
    let allJobs = [];    
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

    // --- 2. FETCH RANKINGS (NESTED DATA SUPPORT) ---
    async function fetchRankings(jobId) {
        const cleanToken = getCleanToken();
        if (!jobId || !cleanToken) return;

        try {
            tableBody.innerHTML = '<div style="padding: 40px; text-align: center; color: #7311D4;"><i class="bx bx-loader-alt bx-spin"></i> Analyzing rankings...</div>';
            
            const response = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}/rankings`, {
                headers: { 'Authorization': `Bearer ${cleanToken}` }
            });
            const result = await response.json();
            
            // Accessing the new nested structure
            const rankedData = result.data?.ranked || [];
            const excludedData = result.data?.excluded || [];

            // Mapping Ranked Candidates
            const rankedMapped = rankedData.map(item => ({
                rank: item.rank || '-',
                name: item.email.split('@')[0], // Use email prefix if name isn't available
                email: item.email,
                score: item.assessmentScore || 0,
                time: item.timeTaken ? `${item.timeTaken} min` : "0 min",
                correct: item.rawScore ? `${item.rawScore}/${item.maxScore}` : "Assessed",
                result: item.assessmentScore >= 60 ? "Passed" : "Failed",
                isExcluded: false
            }));

            // Mapping Excluded Candidates
            const excludedMapped = excludedData.map(item => ({
                rank: 'Excl',
                name: item.email.split('@')[0],
                email: item.email,
                score: 0,
                time: "N/A",
                correct: "Late/None",
                result: "Excluded",
                isExcluded: true,
                reason: item.reason || "No submission"
            }));

            // Combine both for the full table view
            candidates = [...rankedMapped, ...excludedMapped];

            renderTable(candidates);
            updateStatCards(result.data); // Pass full data for accurate counts
        } catch (err) {
            console.error("Fetch Rankings Error:", err);
            tableBody.innerHTML = '<div style="padding: 20px; color: #e74c3c; text-align: center;">Failed to load candidate ranking data.</div>';
        }
    }

    // --- 3. FETCH ALL JOBS & SYNC STATE ---
    async function initJobSwitcher() {
        const cleanToken = getCleanToken();
        if (!cleanToken) return;

        const urlParams = new URLSearchParams(window.location.search);
        const targetJobId = urlParams.get('id') || localStorage.getItem("last_created_job_id");

        try {
            const response = await fetch(`${BASE_URL}/api/v1/jobs`, {
                headers: { 'Authorization': `Bearer ${cleanToken}` }
            });
            const result = await response.json();
            const rawJobs = result.data || [];

            allJobs = rawJobs.filter(job => {
                const status = (job.status || "").toLowerCase();
                return status === 'active' || status === 'published' || status === 'open';
            });

            if (targetJobId) {
                const foundIndex = allJobs.findIndex(j => (j._id === targetJobId || j.id === targetJobId));
                currentJobIndex = (foundIndex !== -1) ? foundIndex : 0;
            }

            if (allJobs.length > 0) {
                updateJobUI(allJobs[currentJobIndex]);
            } else {
                if (jobTitleDisplay) jobTitleDisplay.innerText = "No Active Assessments";
                tableBody.innerHTML = '<div style="padding: 60px; text-align: center; color: #888;">No active jobs found.</div>';
            }
        } catch (err) {
            console.error("Job Switcher Error:", err);
        }
    }

    // --- 4. UI & NAVIGATION UPDATERS ---
    window.switchJob = (direction) => {
        if (allJobs.length === 0) return;
        if (direction === 'next' && currentJobIndex < allJobs.length - 1) currentJobIndex++;
        else if (direction === 'prev' && currentJobIndex > 0) currentJobIndex--;
        else return;

        const selectedJob = allJobs[currentJobIndex];
        localStorage.setItem("last_created_job_id", selectedJob._id || selectedJob.id);
        updateJobUI(selectedJob);
    };

    function updateJobUI(job) {
        if (jobTitleDisplay) jobTitleDisplay.innerText = job.title || job.name || "Untitled Role";
        const metaContainer = document.querySelector('.assessment-test3');
        if (metaContainer) {
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

    // --- 5. STATS UPDATE (USING DIRECT API COUNTS) ---
    function updateStatCards(data) {
        const statHeads = document.querySelectorAll('.rank-candidate-box h1');
        if (statHeads.length >= 3) {
            statHeads[0].innerText = data.totalRanked || 0;
            statHeads[1].innerText = data.ranked?.filter(c => c.assessmentScore >= 60).length || 0;
            statHeads[2].innerText = data.totalExcluded || 0;
        }
        const footerSpan = document.querySelector('.footer span');
        if (footerSpan) footerSpan.innerText = `Total Applications: ${data.totalApplications || 0}`;
    }

    // --- 6. TABLE ---
    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = '<div style="padding: 60px; text-align: center; color: #888; width: 100%;"><p>No candidate data available.</p></div>';
            return;
        }

        data.forEach((c) => {
            const row = document.createElement("div");
            row.className = `row ${c.isExcluded ? 'excluded-row' : ''}`;
            
            row.innerHTML = `
                <span>${c.rank}</span>
                <span>
                    <strong>${c.name}</strong><br/>
                    <small style="color: #666; font-size: 11px;">${c.email}</small>
                </span>
                <span>
                    ${c.isExcluded ? '0%' : c.score + '%'}
                    <div class="progress">
                        <span style="width:${c.score}%"></span>
                    </div>
                </span>
                <span>${c.time}</span>
                <span>${c.correct}</span>
                <span>
                    <span class="status ${c.result.toLowerCase()}">${c.result}</span>
                </span>
                <span class="row-actions">
                    ${c.isExcluded 
                        ? `<small style="color: #e74c3c;">${c.reason.replace('_', ' ')}</small>` 
                        : `<button class="btn primary">View Profile</button>
                           <button class="btn secondary">Save</button>`}
                </span>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- 7. SORTING ---
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            if (candidates.length === 0) return;
            let sorted = [...candidates];
            if (sortSelect.value === "high") sorted.sort((a, b) => b.score - a.score);
            else sorted.sort((a, b) => a.score - b.score);
            renderTable(sorted);
        });
    }

    initJobSwitcher();
});