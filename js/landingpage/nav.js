
const Navbar = {
    init() {
        const target = document.getElementById('navbar-target');
        if (!target) return;

        target.innerHTML = `
            <div class="nav-container">
                <div class="nav-logo" onclick="window.location.href='index.html'" style="cursor: pointer;">
                    <img src="images/logo.png" alt="HiredeyGo">
                </div>
                <nav class="nav-menu" id="navMenu">
                    <a href="index.html" class="nav-link active">Home</a>
                    <a href="#" class="nav-link">Find Jobs</a>
                    <a href="#" class="nav-link">Candidates</a>
                    <a href="./dashboard/index.html" class="nav-link">Dashboard</a>
                </nav>
                <div class="nav-actions">
                    <button class="btn-login" id="loginBtn">Log In</button>
                    <button href="postajob.html" class="btn-primary-nav">Post a Job</button>
                    <button class="mobile-toggle" id="mobileToggle">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        `;
        this.bindEvents();
    },

    bindEvents() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        const loginBtn = document.getElementById('loginBtn');
        const postJobBtn = document.getElementById('postJobBtn');
        
        // 1. Mobile Menu Toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-active');
            });
        }

        // 2. Navigation to Login Page
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
            
                window.location.href = 'login.html'; 
            });
        }

        // 3. Post a Job (Usually requires login first)
        if (postJobBtn) {
            postJobBtn.addEventListener('click', () => {
                window.location.href = 'login.html#signup';
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => Navbar.init());