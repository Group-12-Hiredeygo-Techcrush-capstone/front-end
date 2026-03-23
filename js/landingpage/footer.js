/**
 * footer.js - Responsive Footer Component
 */
const Footer = {
    init(customTargetId) {
        // Use the passed ID or default to 'footer-target'
        const targetId = customTargetId || 'footer-target';
        const target = document.getElementById(targetId);
        
        if (!target) {
            console.error("Footer target not found");
            return;
        }

        target.innerHTML = `
            <footer class="main-footer">
                <div class="footer-content-row">
                    
                    <div class="footer-brand-col">
                        <div class="brand-logo-container">
                             <img src="images/logo.png" alt="HiredeyGo Logo" class="footer-logo-img">
                             <span class="brand-name">HiredeyGo</span>
                        </div>

                        <div class="brand-desc-container">
                            <p>The modern standard for recruitment. Find talent faster, better, and with more confidence.</p>
                        </div>
                       
                        <div class="brand-social-container">
                            <a href="#" class="social-link-circle" title="Website">
                                <img src="images/share.png" alt="Web" class="social-icon-img">
                            </a>
                            <a href="#" class="social-link-circle" title="Contact">
                                <img src="images/shared.png" alt="Contact" class="social-icon-img">
                            </a>
                            <a href="#" class="social-link-circle" title="Twitter">
                                <img src="images/twitter.svg" alt="Twitter" class="social-icon-img">
                            </a>
                        </div>
                    </div>

                    <div class="footer-links-col">
                        <h4>Product</h4>
                        <ul class="footer-link-list">
                            <li><a href="#" class="footer-link-item">Candidate Search</a></li>
                            <li><a href="#" class="footer-link-item">AI Ranking</a></li>
                            <li><a href="#" class="footer-link-item">Applicant Tracking</a></li>
                            <li><a href="#" class="footer-link-item">Integrations</a></li>
                        </ul>
                    </div>

                    <div class="footer-links-col">
                        <h4>Company</h4>
                        <ul class="footer-link-list">
                            <li><a href="#" class="footer-link-item">About Us</a></li>
                            <li><a href="#" class="footer-link-item">Careers</a></li>
                            <li><a href="#" class="footer-link-item">Contact</a></li>
                            <li><a href="#" class="footer-link-item">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div class="footer-links-col-resources">
                        <h4>Resources</h4>
                        <ul class="footer-resources-list">
                            <li><a href="#" class="footer-resource-link">Hiring Guide</a></li>
                            <li><a href="#" class="footer-resource-link">Recruiter Blog</a></li>
                            <li><a href="#" class="footer-resource-link">Customer Stories</a></li>
                            <li class="support-center-frame">
                                <a href="#" class="footer-resource-link">Support Center</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom-border">
                    <div class="footer-copyright-box">
                        <p class="footer-copyright-text">© 2026 HireDeyGo. All rights reserved.</p>
                    </div>
                    <div class="footer-bottom-links">
                        <a href="#" class="footer-bottom-link">Terms of Service</a>
                        <a href="#" class="footer-bottom-link">Cookie Policy</a>
                    </div>
                </div>
            </footer>
        `;
    }
};


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('footer-target') && !document.querySelector('.main-footer')) {
        Footer.init();
    }
});