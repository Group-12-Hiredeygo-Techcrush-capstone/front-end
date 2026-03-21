
document.addEventListener("DOMContentLoaded", () => {
    const finishBtn = document.querySelector(".continue-btn");

    const mapLocation = document.querySelector("textarea");
    const phoneNumber = document.querySelector("input[type='number']");
    const email = document.querySelector("input[type='text']");

    finishBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Get values
        const location = mapLocation.value.trim();
        const phone = phoneNumber.value.trim();
        const userEmail = email.value.trim();

        // Basic validation
        if (!location || !phone || !userEmail) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch("https://hire-dey-go-be.onrender.com/api/v1/auth/setup-contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // If you are using token authentication
                    // "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    mapLocation: location,
                    phoneNumber: `+234${phone}`,
                    email: userEmail
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Contact info saved successfully ✅");

                // Redirect to profile page
                window.location.href = "profilesetup5.html";
            } else {
                alert(data.message || "Something went wrong");
            }

        } catch (error) {
            console.error(error);
            alert("Network error. Try again.");
        }
    });
});
