/* emailverification.js */
document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    const verifyBtn = document.querySelector(".verify-btn");
    const resendLink = document.querySelector(".box a");
    const emailSpan = document.querySelector(".container2 span");

    // 1. Get Email from URL
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    
    if (email) {
        emailSpan.textContent = email;
    } else {
        emailSpan.textContent = "your email";
    }

    // 2. OTP Auto-focus logic
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

    // 3. Verify OTP Logic
    verifyBtn.addEventListener("click", async () => {
        // Collect OTP and convert to a Number to prevent 400 Bad Request errors
        const String = Array.from(otpInputs).map(i => i.value).join("");
        const otp = parseInt(String, 10);

        if (!email || email === "your email") {
            alert("Email context is missing. Please restart the signup process.");
            return;
        }

        if (String.length !== 6 || isNaN(otp)) {
            alert("Please enter a valid 6-digit verification code.");
            return;
        }

        verifyBtn.disabled = true;
        const originalText = verifyBtn.textContent;
        verifyBtn.textContent = "Verifying...";

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }) // Sending as string (email) and number (otp)
            });

            const result = await response.json();
            console.log("Full Server Response:", result);

            if (response.ok) {
                // Check every possible location for the token based on typical Render/Node API structures
                const authToken = result.token || 
                                 (result.data && result.data.token) || 
                                 result.accessToken || 
                                 (result.data && result.data.accessToken) ||
                                 result.access_token;
                
                if (authToken) {
                    localStorage.setItem("token", authToken);
                    alert("Email verified successfully!");
                    window.location.href = "profilesetup1.html"; 
                } else {
                    console.error("Token missing in response object:", result);
                    alert("Verification successful, but session token is missing. Redirecting to login.");
                    window.location.href = "index.html"; 
                }
            } else {
                // If status is 400, this will show the backend's specific error message
                alert(result.message || "OTP verification failed. Please check the code.");
            }
        } catch (error) {
            console.error("Network/Server Error:", error);
            alert("Unable to connect to the verification server.");
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
        }
    });

    // 4. RESEND OTP Logic
    resendLink.addEventListener("click", async (e) => {
        e.preventDefault();
        if (!email || email === "your email") return alert("Email missing.");

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }) 
            });

            if (response.ok) {
                alert("A new code has been sent to " + email);
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Could not resend code.");
            }
        } catch (error) {
            alert("Network error. Please try again.");
        }
    });
});