const form = document.getElementById("registerForm");
const message = document.getElementById("message");
const button = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.textContent = "";
    button.textContent = "Creating...";
    button.disabled = true;

    const data = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        companyName: document.getElementById("companyName").value,
        companyAddress: document.getElementById("companyAddress").value,
        companySize: document.getElementById("companySize").value,
        role: "recruiter"
    };

    try {
        const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Registration successful! Redirecting to OTP verification...";

            form.reset();

            // redirect to OTP page after 1.5 seconds
            setTimeout(() => {
                // pass the email to OTP page via query params
                window.location.href = `emailverification.html?email=${encodeURIComponent(data.email)}`;
            }, 1500);

        } else {
            message.style.color = "red";
            message.textContent = result.message || "Registration failed";
        }

    } catch (error) {
        message.style.color = "red";
        message.textContent = "Network error. Try again.";
    }

    button.textContent = "Create Account →";
    button.disabled = false;
});