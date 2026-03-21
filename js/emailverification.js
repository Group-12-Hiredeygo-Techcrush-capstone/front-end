document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const verifyBtn = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".box a");
    const emailSpan = document.querySelector(".container2 span");

    // 1. GET EMAIL FROM URL PARAMS
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    
    if (email) {
        emailSpan.textContent = email;
    } else {
        emailSpan.textContent = "your email";
        console.warn("No email found in URL parameters. Verification may fail.");
    }

    // 2. AUTO-FOCUS LOGIC FOR OTP INPUTS
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

    // 3. HANDLE OTP VERIFICATION
    verifyBtn.addEventListener("click", async () => {
        const otp = Array.from(otpInputs).map(i => i.value).join("");

        if (otp.length !== 6) {
            alert("Please enter the 6-digit verification code.");
            return;
        }

        // Show loading state
        verifyBtn.disabled = true;
        const originalText = verifyBtn.textContent;
        verifyBtn.textContent = "Verifying...";

        try {
            // Updated Endpoint: /api/v1/auth/verify-email
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok) {
                // Save token if returned by verification
                if (result.token) localStorage.setItem("token", result.token);
                
                alert("Email verified successfully! Welcome to HiredeyGo.");
                // Redirect to the Recruiters Dashboard
                window.location.href = "html/recruitersdashboard.html";
            } else {
                alert(result.message || "OTP verification failed. Please check the code.");
            }

        } catch (error) {
            console.error("Verification Error:", error);
            alert("Connection error. Please try again shortly.");
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
        }
    });

    // 4. RESEND OTP
    resendLink.addEventListener("click", async (e) => {
        e.preventDefault();
        
        if (!email) {
            alert("Email address missing. Please go back to the previous page.");
            return;
        }

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }) 
            });

            if (response.ok) {
                alert("A new verification code has been sent to your email.");
            } else {
                const result = await response.json();
                alert(result.message || "Could not resend code.");
            }
        } catch (error) {
            alert("Network error. Try again.");
        }
    });
});