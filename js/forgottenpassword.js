// Select the button and input from your HTML
const resetBtn = document.querySelector(".reset-btn");
const emailInput = document.querySelector(".input-field input");

// Add click event to the button
resetBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get the email value
    const email = emailInput.value.trim();

    // Validate input
    if (!email) {
        alert("Please enter your email address");
        return;
    }

    try {
        // Send request to your API
        const response = await fetch(
            "https://hire-dey-go-be.onrender.com/api/v1/auth/reset-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        // Convert response to JSON
        const data = await response.json();

        // Handle success
        if (response.ok) {
            alert("✅ Reset link sent! Check your email.");
            emailInput.value = ""; // clear input
        } else {
            alert(data.message || "Something went wrong");
        }
    } catch (error) {
        console.error(error);
        alert("⚠️ Network error. Please try again.");
    }
});

// Select the close button
const closeBtn = document.querySelector(".security-guard-close");

// Add click event
closeBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // your landing page
});
// select the back button
const backBtn = document.querySelector(".back-btn");

// add click event
backBtn.addEventListener("click",()=>{
    window.location.href = "index.html";
});