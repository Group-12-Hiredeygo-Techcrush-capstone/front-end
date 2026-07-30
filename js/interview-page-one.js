// interview-page-one.js
// Handles 'Mark As Done' button interactivity

document.addEventListener('DOMContentLoaded', function() {
  // Select all Mark As Done buttons
  const markDoneButtons = document.querySelectorAll('.third-div-btn');
  markDoneButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      // Show confirmation
      alert('Candidate has been marked as done!');
      // Optionally, you can disable the button or change its text
      // btn.disabled = true;
      // btn.textContent = 'Marked';
    });
  });
});
