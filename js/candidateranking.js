document.addEventListener('DOMContentLoaded', async () => {
    const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
    const tableBody = document.getElementById("tableBody");
    const sortSelect = document.getElementById("sortSelect");
    const jobTitleDisplay = document.querySelector(".assessment-test2 h2");

    let candidates = [];
    let allJobs = [];
    let currentJobIndex = 0;

    // ✅ TOKEN HELPER (FIXED SAFE PARSE)
    const getCleanToken = () => {
        try {
            let token = localStorage.getItem("token") 
                || localStorage.getItem("HireDeyGo_UserPlanStarterauth_token");

            if (!token) return null;

            const parsed = JSON.parse(token);
            return parsed?.tokens?.accessToken || parsed?.token || token;
        } catch {
            return localStorage.getItem("token");
        }
    };

    // ✅ FETCH RANKINGS (FIXED ENDPOINT USAGE)
    async function fetchRankings(jobId) {
        const cleanToken = getCleanToken();

        if (!jobId || !cleanToken) {
            tableBody.innerHTML = `<p style="padding:20px;color:red;">Missing Job ID or Token</p>`;
            return;
        }

        try {
            tableBody.innerHTML = `<p style="padding:20px;">Loading candidates...</p>`;

            const res = await fetch(
                `${BASE_URL}/api/v1/jobs/${jobId}/rankings`,
                {
                    headers: {
                        Authorization: `Bearer ${cleanToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const result = await res.json();

            // ✅ FLEXIBLE RESPONSE HANDLING
            const apiData =
                result?.data ||
                result?.data?.rankings ||
                result?.rankings ||
                result?.results ||
                [];

            candidates = apiData.map(item => ({
                name: item?.user?.name || "Unknown",
                email: item?.user?.email || "N/A",
                score: item?.score || 0,
                time: item?.timeTaken || "0 min",
                correct: item?.correctAnswers || "0/0",
                result: item?.score >= 60 ? "Passed" : "Failed"
            }));

            renderTable(candidates);
            updateStatCards(candidates);

        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<p style="padding:20px;color:red;">Failed to fetch rankings</p>`;
        }
    }

    // ✅ FETCH JOBS
    async function initJobSwitcher() {
        const token = getCleanToken();

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/v1/jobs`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await res.json();

            const rawJobs = result?.data || [];

            // ✅ FILTER ACTIVE JOBS
            allJobs = rawJobs.filter(job => {
                const status = (job?.status || "").toLowerCase();
                return ["active", "published", "open"].includes(status);
            });

            if (allJobs.length === 0) {
                jobTitleDisplay.innerText = "No Active Jobs";
                tableBody.innerHTML = `<p style="padding:40px;">No jobs found</p>`;
                return;
            }

            updateJobUI(allJobs[0]);

        } catch (err) {
            console.error(err);
        }
    }

    // ✅ UPDATE UI
    function updateJobUI(job) {
        jobTitleDisplay.innerText = job?.title || job?.name || "Untitled Job";

        fetchRankings(job?._id || job?.id);
    }

    // ✅ STATS
    function updateStatCards(data) {
        const total = data.length;
        const passed = data.filter(c => c.result === "Passed").length;
        const avg = total
            ? Math.round(data.reduce((a, b) => a + b.score, 0) / total)
            : 0;

        const stats = document.querySelectorAll('.rank-candidate-box h1');

        if (stats.length >= 3) {
            stats[0].innerText = total;
            stats[1].innerText = passed;
            stats[2].innerText = `${avg}%`;
        }
    }

    // ✅ TABLE RENDER (FIXED HTML)
    function renderTable(data) {
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = `<p style="padding:40px;">No candidates yet</p>`;
            return;
        }

        data.forEach((c, i) => {
            const row = document.createElement("div");
            row.className = "row";

            row.innerHTML = `
                <span>${i + 1}</span>
                <span>
                    <strong>${c.name}</strong><br/>
                    <small>${c.email}</small>
                </span>
                <span>${c.score}%</span>
                <span>${c.time}</span>
                <span>${c.correct}</span>
                <span class="status ${c.result.toLowerCase()}">${c.result}</span>
            `;

            tableBody.appendChild(row);
        });
    }

    // ✅ SORT
    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
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
