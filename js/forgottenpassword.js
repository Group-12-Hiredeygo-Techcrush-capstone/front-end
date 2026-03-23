// Select the elements from your HTML
const resetBtn = document.querySelector(".reset-btn");
const emailInput = document.getElementById("email");
const closeBtn = document.querySelector(".security-guard-close");
const backBtn = document.querySelector(".back-btn");

// Handle Forgot Password Form Submission
resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // 1. Basic Validation
    if (!email) {
        alert("Please enter your email address");
        return;
    }

    // 2. Simple format check
    if (!email.includes("@")) {
        alert("Please enter a valid email address");
        return;
    }

    try {
        // 3. Loading State (Prevents double clicks)
        resetBtn.innerText = "Sending...";
        resetBtn.disabled = true;

        // 4. API Call to the correct endpoint
        const response = await fetch(
            "https://hire-dey-go-be.onrender.com/api/v1/auth/forgot-password", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email }),
            }
        );

        const data = await response.json();

        // 5. Handle Response
        if (response.ok) {
            alert("✅ Reset link sent! Please check your email inbox.");
            emailInput.value = ""; // clear input
        } else {
            // Display error from backend (e.g., "User not found")
            alert(data.message || "Failed to send reset link. Please try again.");
        }
    } catch (error) {
        console.error("Forgot Password Error:", error);
        alert("⚠️ Network error. Please check your internet connection.");
    } finally {
        // 6. Restore button state
        resetBtn.innerText = "Send Reset Link";
        resetBtn.disabled = false;
    }
});

// Navigation logic
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        window.location.href = "index.html"; 
    });
}

if (backBtn) {
    backBtn.addEventListener("click", () => {
        // Using history.back() is usually better for forgot password 
        // as it takes them back to the specific login screen they left
        window.history.back(); 
    });
}