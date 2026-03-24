document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("my-form");
    const emailInput = document.getElementById("Username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");
    const spinner = document.getElementById("spinner");
    const submitBtn = document.getElementById("submitBtn");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById("remember")?.checked;

        if (spinner) spinner.classList.remove("hidden");
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Invalid credentials.");
            }

           
            const token = result.tokens?.accessToken || 
                          result.token || 
                          (result.data && (result.data.token || result.data.accessToken));

            const user = result.data || result.user || {};

            if (token) {
                // Save to BOTH 
                localStorage.setItem("token", token);
                sessionStorage.setItem("token", token);
                
                // Save COMPANY info
                const name = user.companyName || user.name || user.firstName || "Recruiter";
                localStorage.setItem("userName", name);
                localStorage.setItem("companyProfile_Full", JSON.stringify(user));

                message.textContent = "Login successful! Redirecting...";
                message.style.color = "#2ecc71";

                setTimeout(() => {
                    window.location.href = "recruitersdashboard.html";
                }, 800);
            } else {
                console.error("Token structure not found in:", result.tokens);
                throw new Error("Login succeeded, but the security token is missing.");
            }

        } catch (err) {
            console.error("Login Error:", err);
            if (message) {
                message.textContent = err.message;
                message.style.color = "#e74c3c";
            }
        } finally {
            if (spinner) spinner.classList.add("hidden");
            submitBtn.disabled = false;
        }
    });
});