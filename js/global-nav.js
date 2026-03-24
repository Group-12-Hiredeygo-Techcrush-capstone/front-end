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
        <div style="display: flex; align-items: center;">
            <i class='bx bx-menu' id="menu-toggle" style="display: none; font-size: 3rem; cursor: pointer; margin-right: 15px; color: #7F13EC;"></i>
            <img src="images/hiredeygologo.png" alt="HiredeyGo Logo">
        </div>
        <div class="postajob-container">
            <i class="bx bx-bell"></i>
            <button class="postajob-btn" id="navPostJobBtn">Post A job</button>
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
            <div class="text-input" data-page="postajob2.html">
                <img src="images/gg_add.svg" class="text-icon">
                <a href="#" id="sidePostJobBtn">Post a Job</a>
            </div>
            <div class="text-input" data-page="myjobs.html">
                <img src="images/uit_bag.svg" class="text-icon">
                <a href="myjobs.html">My Jobs</a>
            </div>
            <div class="text-input" data-page="candidateranking.html">
                <img src="images/fluent-emoji-high-contrast_sports-medal.svg" class="text-icon">
                <a href="candidateranking.html">Candidate Ranking</a>
            </div>

<div class="text-input" data-page="savedcandidate.html">
    <img src="images/material-symbols_bookmark-outline.svg" class="text-icon">
    <a href="savedcandidate.html">Saved Candidate</a> 
</div>
            <div class="text-input" data-page="plans&billing.html">
                <img src="images/streamline-flex_bill-4.svg" class="text-icon">
                <a href="plans&billing.html">Plans and Billings</a>
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

    // 2. The Gatekeeper Logic
    const handlePostJobRedirect = (e) => {
        if (e) e.preventDefault();
        const userPlan = localStorage.getItem('HireDeyGo_UserPlan');
        if (userPlan === 'Basic' || userPlan === 'Starter') {
            window.location.href = 'postajob2.html';
        } else {
            window.location.href = 'plans&billing.html';
        }
    };

    const navBtn = document.getElementById('navPostJobBtn');
    const sideBtn = document.getElementById('sidePostJobBtn');
    if (navBtn) navBtn.addEventListener('click', handlePostJobRedirect);
    if (sideBtn) sideBtn.addEventListener('click', handlePostJobRedirect);

    // 3. The Highlight Logic
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.text-input').forEach(item => {
        if (item.getAttribute('data-page') === currentPage) {
            item.classList.add('active');
        }
    });

    // 4. Global Logout
    const logout = document.getElementById('logOutBtn');
    if (logout) {
        logout.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                window.location.href = 'index.html';
            }
        });
    }

    // 5. Mobile Menu Toggle Logic
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('global-sidebar');
        if (e.target.id === 'menu-toggle' || e.target.closest('#menu-toggle')) {
            sidebar.classList.toggle('open');
        } else if (sidebar && !sidebar.contains(e.target) && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
});