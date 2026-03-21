const navigationData = {
    header: `
        <nav class="nav-bar">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="#">Find Candidates</a></li>
                <li><a href="recruitersdashboard.html">Dashboard</a></li>
                <li><a href="#">My Jobs</a></li>
                <li><a href="#">Applications</a></li>
                <li><a href="#">Customer Support</a></li>
            </ul>
        </nav>`,
    logoBar: `
        <img src="images/hiredeygologo.png" alt="eClear Logo">
        <div class="postajob-container">
            <i class="bx bx-bell"></i>
            <button class="postajob-btn" onclick="window.location.href='postajob.html'">Post A job</button>
            <i class="bx bx-user-circle"></i>
            <i class="bx bx-chevron-down"></i>
        </div>`,
    sidebar: `
        <div class="employer-title"><h2>Employers Dashboard</h2></div>
        <div class="text-container">
            <div class="text-input" data-page="recruitersdashboard.html">
                <img src="images/ri_stack-fill.svg" class="text-icon">
                <a href="recruitersdashboard.html">Overview</a>
            </div>
            <div class="text-input" data-page="employersprofile.html">
                <img src="images/profile.svg" class="text-icon">
                <a href="employersprofile.html">Employers Profile</a>
            </div>
            <div class="text-input" data-page="postajob.html">
                <img src="images/gg_add.svg" class="text-icon">
                <a href="postajob.html">Post a Job</a>
            </div>
            <div class="text-input" data-page="myjobs.html">
                <img src="images/uit_bag.svg" class="text-icon">
                <a href="#">My Jobs</a>
            </div>
            <div class="text-input" data-page="candidateranking.html">
                <img src="images/fluent-emoji-high-contrast_sports-medal.svg" class="text-icon">
                <a href="candidateranking.html">Candidate Ranking</a>
            </div>
            <div class="text-input" data-page="savedcandidates.html">
                <img src="images/material-symbols_bookmark-outline.svg" class="text-icon">
                <a href="#">Saved Candidate</a>
            </div>
            <div class="text-input" data-page="billing.html">
                <img src="images/streamline-flex_bill-4.svg" class="text-icon">
                <a href="#">Plans and Billings</a>
            </div>
            <div class="text-input" data-page="settings.html">
                <img src="images/settings.svg" class="text-icon">
                <a href="#">Settings</a>
            </div>
            
            <div class="log-out-btn" id="logOutBtn">
                <div><img src="images/logout icon.svg" class="log-out-icon" alt="Logout"></div>
                <div class="side-text"><h5>Log-out</h5></div>
            </div>
        </div>`
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Injections
    const h = document.getElementById('global-header');
    const l = document.getElementById('global-logo-bar');
    const s = document.getElementById('global-sidebar');

    if (h) h.innerHTML = navigationData.header;
    if (l) l.innerHTML = navigationData.logoBar;
    if (s) s.innerHTML = navigationData.sidebar;

    // 2. The "Perfect" Highlight Logic
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.text-input').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });

    // 3. Global Logout
    const logout = document.getElementById('logOutBtn');
    if (logout) {
        logout.addEventListener('click', () => {
            if(confirm("Are you sure you want to log out?")) window.location.href = 'index.html';
        });
    }
});