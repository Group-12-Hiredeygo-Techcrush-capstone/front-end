document.addEventListener('DOMContentLoaded', () => {
    // 1. Set the Dynamic Username
    const userSpan = document.querySelector('.username');
    if (userSpan) {
        // You can change this to pull from a database or localStorage later
        userSpan.textContent = "Paystack Official"; 
    }

    // 2. Handle Edit Profile Button
    const editBtn = document.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            alert("Redirecting to Profile Editor...");
            // window.location.href = 'edit-profile.html';
        });
    }

    // 3. Handle Share Profile Button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const profileUrl = window.location.href;
            navigator.clipboard.writeText(profileUrl);
            alert("Profile link copied to clipboard!");
        });
    }
});