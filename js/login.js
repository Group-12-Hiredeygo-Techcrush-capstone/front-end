document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("my-form");
    const emailInput = document.getElementById("Username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");
    const spinner = document.getElementById("spinner");
    const submitBtn = document.getElementById("submitBtn");
    const eyeIcon = document.querySelector(".ph-eye");

    // Password Visibility Toggle
    if (eyeIcon) {
        eyeIcon.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            eyeIcon.classList.toggle("ph-eye-slash");
        });
    }

    // Login Form Submission
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById("remember").checked;

        message.textContent = "";

        if (!email || !password) {
            message.textContent = "Please enter your email and password.";
            message.style.color = "#e74c3c";
            return;
        }

        // Show spinner & disable button
        if (spinner) spinner.classList.remove("hidden");
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in...";

        try {
            const response = await fetch(
                "https://hire-dey-go-be.onrender.com/api/v1/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data?.message || data?.error || "Login failed. Please check your credentials.";
                throw new Error(errorMessage);
            }

            // Success Logic
            message.textContent = "Login successful. Redirecting...";
            message.style.color = "#2ecc71";

            const storage = rememberMe ? localStorage : sessionStorage;

            // Save Token
            if (data?.token) {
                storage.setItem("token", data.token);
            }

            // Save User Name for "Recognition" on dashboard
            // We check multiple possible paths from the backend
            const nameToSave = data?.user?.companyName || data?.user?.name || "Recruiter";
            storage.setItem("userName", nameToSave);

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = "recruitersdashboard.html";
            }, 1000);

        } catch (err) {
            console.error("Login Error:", err);
            message.textContent = err.message;
            message.style.color = "#e74c3c";
        } finally {
            if (spinner) spinner.classList.add("hidden");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign in to workspace";
        }
    });
});