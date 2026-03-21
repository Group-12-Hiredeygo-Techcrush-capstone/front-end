document.addEventListener('DOMContentLoaded', () => {
    // 1. Set the Dynamic Username
    const userSpan = document.querySelector('.username');
    if (userSpan) {
        userSpan.textContent = "Paystack Official"; // Or pull from localStorage
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

    // 4. Sidebar 'Active' State Logic
    const navLinks = document.querySelectorAll('.text-input a');
    navLinks.forEach(link => {
        if (link.href.includes('employersprofile.html')) {
            link.parentElement.style.background = "#FFFFFF";
            link.style.color = "#7F13EC";
            // Makes the icon visible against white background
            const icon = link.parentElement.querySelector('.text-icon');
            if(icon) icon.style.filter = "none"; 
        }
    });
});