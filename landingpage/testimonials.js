/**
 * testimonials.js - High-End Testimonial Grid
 */
const Testimonials = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        target.innerHTML = `
            <section class="testi-section">
                <div class="testi-blur-overlay"></div>
                
                <div class="testi-container">
                    <div class="testi-main">
                        <h2 class="testi-heading">Loved by HR Professionals & Hiring Managers Worldwide</h2>
                        
                        <div class="main-card glass-card">
                            <div class="star-row">
                                ${Array(5).fill('<div class="star-icon"></div>').join('')}
                            </div>
                            <p class="main-quote">
                                "HiredeyGo has transformed our hiring process. The AI ranking saves us at least 15 hours a week in screening. The quality of candidates is unparalleled."
                            </p>
                            <div class="user-info">
                                <div class="user-avatar"></div>
                                <div class="user-details">
                                    <span class="user-name">Jessica Walsh</span>
                                    <span class="user-title">Head of Talent, DesignCo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="testi-grid">
                        <div class="testi-col">
                            <div class="small-card glass-card no-bg">
                                <p>"Best ROI we've seen on any hiring platform. Period."</p>
                                <span>— Prosper N., CTO</span>
                            </div>
                            <div class="small-card purple-card">
                                <p>"The interface is so clean, our whole team actually enjoys using it."</p>
                                <span>— Sarah M., HR Lead</span>
                            </div>
                        </div>
                        <div class="testi-col">
                            <div class="small-card purple-card">
                                <p>"Found our lead engineer in less than 2 weeks."</p>
                                <span>— Michael R., Founder</span>
                            </div>
                            <div class="small-card glass-card no-bg">
                                <p>"Integration with our existing tools was seamless."</p>
                                <span>— Emily L., Recruiter</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};