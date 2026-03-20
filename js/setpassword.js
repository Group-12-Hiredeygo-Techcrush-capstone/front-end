const form = document.getElementById("resetForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const errorMsg = document.getElementById("errorMsg");
const strengthText = document.getElementById("strengthText");

// API details
const BASE_URL = "https://hire-dey-go-be.onrender.com";
const ENDPOINT = "/api/v1/auth/reset-password";

// Password strength checker
password.addEventListener("input", () => {
  const value = password.value;

  if (value.length < 6) {
    strengthText.textContent = "Weak";
    strengthText.style.color = "red";
  } else if (value.length < 10) {
    strengthText.textContent = "Medium";
    strengthText.style.color = "orange";
  } else {
    strengthText.textContent = "Strong";
    strengthText.style.color = "green";
  }
});

// Submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  errorMsg.textContent = "";

  const pass = password.value;
  const confirm = confirmPassword.value;

  // Validation
  if (pass !== confirm) {
    errorMsg.textContent = "Passwords do not match";
    return;
  }

  if (pass.length < 8) {
    errorMsg.textContent = "Password must be at least 8 characters";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: pass
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    alert("Password updated successfully!");

    // redirect (optional)
    window.location.href = "profilesetup1.html";

  } catch (error) {
    errorMsg.textContent = error.message;
  }
});