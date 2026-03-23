/**
 * howItWorks.js - Vertical Mobile / Horizontal Desktop with Icons
 */
const HowItWorks = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        target.innerHTML = `
            <section class="how-section" id="how-section-trigger">
                <div class="how-header">
                    <h2 class="how-title">How it Works</h2>
                    <p class="how-subtitle">Streamline your hiring process with our automated workflow from initial post to onboarding.</p>
                </div>

                <div class="steps-container">
                    <div class="progress-line">
                        <div class="progress-fill" id="how-progress-fill"></div>
                    </div>

                    <div class="step-item" data-step="1">
                        <div class="step-icon-wrapper color-purple">
                            <div class="step-icon-inner">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </div>
                        </div>
                        <div class="step-text">
                            <h3>Post Your Job</h3>
                            <p>Create a listing with required skills and salary range in under 5 minutes.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="2">
                        <div class="step-icon-wrapper color-green">
                            <div class="step-icon-inner">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                        </div>
                        <div class="step-text">
                            <h3>AI Ranking</h3>
                            <p>Our AI ranks the best matches based on skills and experience.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="3">
                        <div class="step-icon-wrapper color-purple">
                            <div class="step-icon-inner">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                            </div>
                        </div>
                        <div class="step-text">
                            <h3>Interview</h3>
                            <p>Schedule and conduct seamless interviews within the platform.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="4">
                        <div class="step-icon-wrapper color-green">
                            <div class="step-icon-inner">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            </div>
                        </div>
                        <div class="step-text">
                            <h3>Hire</h3>
                            <p>Onboard your perfect team member with integrated documentation.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.initRefinedAnimation();
    },

    initRefinedAnimation() {
        const section = document.getElementById('how-section-trigger');
        const steps = document.querySelectorAll('.step-item');
        const fill = document.getElementById('how-progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startSequence(steps, fill);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 }); 

        observer.observe(section);
    },

    startSequence(steps, fill) {
        const isMobile = window.innerWidth < 768;

        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('is-active');
                
                const progressPercentage = (index / (steps.length - 1)) * 100;
                
                if (isMobile) {
                    fill.style.height = `${progressPercentage}%`;
                    fill.style.width = '100%';
                } else {
                    fill.style.width = `${progressPercentage}%`;
                    fill.style.height = '100%';
                }
                
            }, index * 600); // Slightly faster sequence for 4 steps
        });
    }
};