document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("my-form");
    const emailInput = document.getElementById("Username");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");
    const spinner = document.getElementById("spinner");
    const submitBtn = document.getElementById("submitBtn");
    const eyeIcon = document.querySelector(".ph-eye");

    if (eyeIcon) {
        eyeIcon.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            eyeIcon.classList.toggle("ph-eye-slash");
        });
    }

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        message.textContent = "";
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById("remember").checked;

        if (spinner) spinner.classList.remove("hidden");
        submitBtn.disabled = true;
        submitBtn.textContent = "Verifying credentials...";

        try {
            const response = await fetch(
                "https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || data?.error || "Invalid credentials");
            }

            message.textContent = "Login successful! Welcome back.";
            message.style.color = "#10B981";

            const storage = rememberMe ? localStorage : sessionStorage;
            if (data?.token) storage.setItem("token", data.token);
            if (data?.user?.companyName) storage.setItem("userName", data.user.companyName);

            // 3. FIXED REDIRECT (Removed html/ prefix)
            setTimeout(() => {
                window.location.href = "recruitersdashboard.html";
            }, 1500);

        } catch (err) {
            message.textContent = err.message;
            message.style.color = "#e74c3c";
        } finally {
            if (spinner) spinner.classList.add("hidden");
            submitBtn.disabled = false;
            submitBtn.textContent = "Sign in to workspace";
        }
    });
});