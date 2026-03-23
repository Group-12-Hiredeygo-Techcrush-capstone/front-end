document.addEventListener('DOMContentLoaded', () => {
    const publishBtn = document.querySelector('.submit-btn');
    const benefitButtons = document.querySelectorAll('.benefit-btn');

    // 1. Handle Benefit Button Toggles (UI Only)
    benefitButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active-benefit');
        });
    });

    // 2. Submit to Backend
    if (publishBtn) {
        publishBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Retrieve the token from your established key
            const token = localStorage.getItem('auth_token'); 

            if (!token) {
                alert("You are not logged in. Please log in to post a job.");
                window.location.href = "login.html";
                return;
            }

            // Get selected benefits text
            const selectedBenefits = Array.from(document.querySelectorAll('.active-benefit'))
                                         .map(btn => btn.innerText.trim());

            // Construct the Job Object (No hardcoded ID, backend generates this)
            const jobData = {
                title: document.getElementById('title').value.trim(),
                tags: document.getElementById('tags').value.trim(),
                category: document.getElementById('category').value,
                role: document.getElementById('jobRole').value.trim(),
                company: document.getElementById('companyName').value.trim(),
                salaryType: document.getElementById('salaryType').value,
                personsNeeded: parseInt(document.getElementById('personCount').value) || 1,
                salaryMin: parseFloat(document.getElementById('salaryMin').value) || 0,
                salaryMax: parseFloat(document.getElementById('salaryMax').value) || 0,
                education: document.getElementById('education').value,
                experience: document.getElementById('experience').value,
                jobType: document.getElementById('jobtype').value,
                description: document.getElementById('description').value.trim(),
                benefits: selectedBenefits
            };

            // Basic Frontend Validation
            if (!jobData.title || !jobData.category || !jobData.company || !jobData.description) {
                alert("Please fill in all required fields (Title, Category, Company, and Description).");
                return;
            }

            try {
                publishBtn.innerText = "Publishing...";
                publishBtn.disabled = true;

                // --- BACKEND API CALL ---
                const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(jobData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ Job Published Successfully!");
                    // Redirect to dashboard on success
                    window.location.href = "recruitersdashboard.html";
                } else {
                    // Show backend error message if available
                    alert(`Error: ${result.message || "Failed to post job. Please try again."}`);
                }

            } catch (error) {
                console.error("Connection Error:", error);
                alert("Network error: Could not reach the server. Please check your connection.");
            } finally {
                publishBtn.innerText = "Publish Job";
                publishBtn.disabled = false;
            }
        });
    }
});