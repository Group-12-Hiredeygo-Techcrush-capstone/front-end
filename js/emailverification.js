document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const verifyBtn = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".box a");
    const emailSpan = document.querySelector(".container2 span");

    // get email from query params
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || "your email";
    emailSpan.textContent = email;

    // auto focus next input
    otpInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // handle OTP verification
    verifyBtn.addEventListener("click", async () => {
        const otp = Array.from(otpInputs).map(i => i.value).join("");

        if (otp.length !== 6) {
            alert("Please enter the 6-digit OTP");
            return;
        }

        try {
            const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Email verified successfully!");
                // redirect to login page
                window.location.href = "login.html";
            } else {
                alert(result.message || "OTP verification failed");
            }

        } catch (error) {
            alert("Network error. Try again.");
        }
    });

    // resend OTP
    resendLink.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/auth/refresh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, resend: true })
            });

            const result = await response.json();

            if (response.ok) {
                alert("OTP resent! Check your email.");
            } else {
                alert(result.message || "Failed to resend OTP");
            }
        } catch (error) {
            alert("Network error. Try again.");
        }
    });
});