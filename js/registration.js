document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const companyName = document.getElementById("companyName").value.trim();
    const companyAddress = document.getElementById("companyAddress").value.trim();
    const email = document.getElementById("email").value.trim();
    const companySize = document.getElementById("companySize").value;
    const password = document.getElementById("password").value;
    
    const message = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    message.textContent = "";
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Creating Account...";

    // --- CONFIG ---
    const API_URL = "https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/register";
    const FORCE_TEST_MODE = true; // Set to false when backend is 100% ready

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                companyName, companyAddress, email, companySize, password 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCESS FLOW
            message.textContent = "Account created! Moving to Profile Setup...";
            message.style.color = "#10B981";
            if (data?.token) localStorage.setItem("auth_token", data.token);
            localStorage.setItem("company_name", companyName);

            setTimeout(() => { window.location.href = "profilesetup1.html"; }, 2000);
        } else {
            // BACKEND ERROR FLOW (e.g. Email exists or Server Bug)
            console.error("Backend Error:", data.message);
            
            if (FORCE_TEST_MODE) {
                message.textContent = "Backend Error, but bypassing for UI testing...";
                message.style.color = "#f39c12";
                localStorage.setItem("auth_token", "test_token_bypassed");
                localStorage.setItem("company_name", companyName);
                setTimeout(() => { window.location.href = "profilesetup1.html"; }, 2000);
            } else {
                message.textContent = data?.message || "Registration failed.";
                message.style.color = "#e74c3c";
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }

    } catch (err) {
        // NETWORK ERROR FLOW (Server is totally down)
        console.warn("Network Error - Entering Test Mode...");
        message.textContent = "Connection Error: Proceeding to setup for testing...";
        message.style.color = "#f39c12";

        localStorage.setItem("auth_token", "test_mode_token_123");
        localStorage.setItem("company_name", companyName);

        setTimeout(() => { window.location.href = "profilesetup1.html"; }, 2000);
    }
});