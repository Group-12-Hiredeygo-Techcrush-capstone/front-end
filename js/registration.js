/* registration.js - Full Integrated Version (Token Capture Enabled) */
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const companyName = document.getElementById("companyName").value.trim();
    const companyAddress = document.getElementById("companyAddress").value.trim();
    const email = document.getElementById("email").value.trim();
    const companySize = document.getElementById("companySize").value;
    const password = document.getElementById("password").value;
    
    const message = document.getElementById("message");
    const submitBtn = document.getElementById("submitBtn");

    if (message) message.textContent = "";
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = "Creating Account...";

    const API_URL = "https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/register/recruiter";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, companyName, companyAddress, companySize }),
        });

        // DEBUG: Log the status code
        console.log("Response Status:", response.status);

        const data = await response.json().catch(() => null);

        if (response.ok) {
            // --- TOKEN CAPTURE FROM REGISTRATION ---
            // Grabbing the token immediately as shown in your backend screenshot
            const authToken = data?.tokens?.accessToken || 
                              data?.token || 
                              data?.data?.token;

            if (authToken) {
                // Save to both keys to ensure eClear Profile Setup can find it later
                localStorage.setItem("token", authToken);
                localStorage.setItem("HireDeyGo_UserPlanStarterauth_token", authToken);
                console.log("✅ Registration token secured.");
            }

            message.textContent = "Account created! Redirecting...";
            message.style.color = "#10B981";
            
            // Save basic info for UI branding
            localStorage.setItem("company_name", companyName);

            setTimeout(() => { 
                window.location.href = `emailverification.html?email=${encodeURIComponent(email)}`; 
            }, 1500);

        } else {
            // LOG THE REAL ERROR MESSAGE FROM BACKEND
            console.error("BACKEND ERROR DATA:", data);
            
            message.textContent = data?.message || "Internal Server Error (500). Please check console.";
            message.style.color = "#e74c3c";
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
        
    } catch (err) {
        console.error("FETCH FAILED:", err);
        message.textContent = "Network Error. Please try again.";
        message.style.color = "#e74c3c";
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});