const Navbar = {
    init() {
        const target = document.getElementById('navbar-target');
        if (!target) return;

        target.innerHTML = `
            <div class="nav-container">
                <div class="nav-logo" onclick="window.location.href='index.html'" style="cursor: pointer;">
                    <img src="images/HDGlogo.png" alt="HiredeyGo">
                </div>
                
                <nav class="nav-menu" id="navMenu">
                    <a href="index.html" class="nav-link active">Home</a>
                    <a href="index.html" class="nav-link">Find Jobs</a>
                    <a href="#" class="nav-link">Companies</a>
                    <a href="#" class="nav-link">Pricing</a>
                    <a href="./dashboard/index.html" class="nav-link">Dashboard</a>
                </nav>

                <div class="nav-actions">
                    <button class="btn-login" id="loginBtn">Log In</button>
                    <button class="btn-primary-nav" id="postJobBtn">Post a Job</button>
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
        
        if (mobileToggle) {
            mobileToggle.onclick = (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('mobile-active');
                
                const icon = mobileToggle.querySelector('i');
                if (navMenu.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            };
        }

        // Action Buttons
        document.getElementById('loginBtn').onclick = () => window.location.href = 'login.html';
        document.getElementById('postJobBtn').onclick = () => window.location.href = 'login.html#signup';

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = () => navMenu.classList.remove('mobile-active');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Navbar.init());