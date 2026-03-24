/* emailverification.js - Full Integrated Version (Backend Structure Aligned) */
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
       
        const String = Array.from(otpInputs).map(i => i.value).join("");

        // Basic validation
        if (!email || email === "your email") {
            alert("Email context is missing. Please restart the signup process.");
            return;
        }

        if (String.length !== 6) {
            alert("Please enter a valid 6-digit verification code.");
            return;
        }

        // Loading state
        verifyBtn.disabled = true;
        const originalText = verifyBtn.textContent;
        verifyBtn.textContent = "Verifying...";

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: email, 
                    otp: String 
                }) 
            });

            const result = await response.json();
            console.log("Full Server Response:", result);

            if (response.ok) {
                // --- BACKEND-ALIGNED TOKEN EXTRACTION ---
                // Specifically checking the 'tokens.accessToken' path from backend view
                const authToken = (result.tokens && result.tokens.accessToken) || 
                                  result.token || 
                                  (result.data && result.data.token) || 
                                  (result.data && result.data.accessToken) ||
                                  result.accessToken;

                if (authToken) {
                    // SAVE TO BOTH KEYS FOR COMPATIBILITY: 
                    // 1. 'token' for dashboard/login scripts
                    // 2. 'HireDeyGo_UserPlanStarterauth_token' for Setup scripts
                    localStorage.setItem("HireDeyGo_UserPlanStarterauth_token", authToken);
                    localStorage.setItem("token", authToken);
                    
                    console.log("✅ Token secured in all local storage keys.");
                } else {
                    console.warn("⚠️ Token missing in response. Manual login might be required for Setup.");
                }

                alert("Email verified successfully!");
                // Direct redirect to the first setup page
                window.location.href = "profilesetup1.html"; 
            } else {
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
    resendLink?.addEventListener("click", async (e) => {
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