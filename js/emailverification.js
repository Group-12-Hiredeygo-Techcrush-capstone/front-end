// emailverification.js

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".otp-inputs input");
  const verifyBtn = document.querySelector(".verify-btn");

  // Auto-focus & Backspace handling
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      // Only keep the first character
      input.value = input.value.slice(0, 1);
      // Move to next input if a value is entered
      if (input.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      // On backspace, move focus to previous input
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });

    // Optional: allow only numbers
    input.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
  });

  // Verify button click
  verifyBtn.addEventListener("click", () => {
    const otp = Array.from(inputs).map(input => input.value).join("");
    if (otp.length === inputs.length) {
      alert(`Your OTP is: ${otp}`);
      // Here you can send the OTP to your server for verification
    } else {
      alert("Please enter the complete 6-digit OTP.");
    }
  });
});