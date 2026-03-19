document
  .getElementById("my-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("Username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
    const spinner = document.getElementById("spinner");
    const submitBtn = document.getElementById("submitBtn");

    message.textContent = "";

    if (!email || !password) {
      message.textContent = "Please enter your email and password.";
      message.style.color = "#e74c3c";
      return;
    }

    // ✅ Show spinner & disable button
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
      const response = await fetch(
        "https://hire-dey-go-be.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.message ||
          data?.error ||
          "Login failed. Please check your credentials.";
        message.textContent = errorMessage;
        message.style.color = "#e74c3c";
        return;
      }

      message.textContent = "Login successful. Redirecting...";
      message.style.color = "#2ecc71";

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      window.location.href = "html/recruitersdashboard.html";

    } catch (err) {
      console.error(err);
      message.textContent =
        "Unable to login right now. Please try again shortly.";
      message.style.color = "#e74c3c";
    } finally {
      // ✅ Hide spinner & re-enable button
      spinner.classList.add("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in to workspace";
    }
  });