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

    try {
        const response = await fetch(
            "https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/register/recruiter",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    companyName, companyAddress, email, companySize, password 
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data?.message || "Registration failed.";
            message.style.color = "#e74c3c";
            return;
        }

        message.textContent = "Account created! Entering dashboard...";
        message.style.color = "#10B981";

        if (data?.token) localStorage.setItem("token", data.token);
        localStorage.setItem("userName", companyName);

        // 7. FIXED REDIRECT (Removed html/ prefix)
        setTimeout(() => {
            window.location.href = "recruitersdashboard.html";
        }, 2000);

    } catch (err) {
        message.textContent = "Connection Error. Try again later.";
        message.style.color = "#e74c3c";
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
});