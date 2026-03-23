/* emailverification.js */
document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const verifyBtn = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".box a");
    const emailSpan = document.querySelector(".container2 span");

    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    
    if (email) {
        emailSpan.textContent = email;
    } else {
        emailSpan.textContent = "your email";
    }

    // OTP Auto-focus logic
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

    verifyBtn.addEventListener("click", async () => {
        const otp = Array.from(otpInputs).map(i => i.value).join("");

        if (otp.length !== 6) {
            alert("Please enter the 6-digit verification code.");
            return;
        }

        verifyBtn.disabled = true;
        const originalText = verifyBtn.textContent;
        verifyBtn.textContent = "Verifying...";

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok) {
                // ROBUST TOKEN CAPTURE:
                // Tries result.token, then result.data.token, then result.data (if it's a string)
                const authToken = result.token || 
                                 (result.data && result.data.token) || 
                                 (typeof result.data === 'string' ? result.data : null);
                
                if (authToken) {
                    localStorage.setItem("token", authToken);
                    alert("Email verified successfully!");
                    window.location.href = "profilesetup1.html"; 
                } else {
                    console.error("Token missing in response:", result);
                    alert("Verification successful, but session token is missing. Please log in.");
                }
            } else {
                alert(result.message || "OTP verification failed.");
            }
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Unable to reach the server.");
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
        }
    });

    // RESEND OTP
    resendLink.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!email) return alert("Email address missing.");

        try {
            // Note: If this 404s later, try changing to /resend/otp
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }) 
            });
            if (response.ok) alert("A new code has been sent.");
            else alert("Could not resend code.");
        } catch (error) {
            alert("Network error.");
        }
    });
});