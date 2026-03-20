/**
 * howItWorks.js - Refined Sequential Animation
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
                            <div class="step-shadow shadow-purple"></div>
                            <div class="step-icon-inner">1</div>
                        </div>
                        <div class="step-text">
                            <h3>Post Your Job</h3>
                            <p>Create a listing with required skills and salary range in under 5 minutes.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="2">
                        <div class="step-icon-wrapper color-green">
                            <div class="step-shadow shadow-green"></div>
                            <div class="step-icon-inner">2</div>
                        </div>
                        <div class="step-text">
                            <h3>AI Ranking</h3>
                            <p>Our AI ranks the best matches based on skills and experience.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="3">
                        <div class="step-icon-wrapper color-purple">
                            <div class="step-shadow shadow-purple"></div>
                            <div class="step-icon-inner">3</div>
                        </div>
                        <div class="step-text">
                            <h3>Interview</h3>
                            <p>Schedule and conduct seamless interviews within the platform.</p>
                        </div>
                    </div>

                    <div class="step-item" data-step="4">
                        <div class="step-icon-wrapper color-green">
                            <div class="step-shadow shadow-green"></div>
                            <div class="step-icon-inner">4</div>
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
        
        // We observe the whole section to trigger the sequence once centered
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // threshold: 0.5 means the section is 50% visible (centered)
                if (entry.isIntersecting) {
                    this.startSequence(steps, fill);
                    observer.unobserve(entry.target); // Run only once
                }
            });
        }, { threshold: 0.5 }); 

        observer.observe(section);
    },

    startSequence(steps, fill) {
        steps.forEach((step, index) => {
            // Delay each step by 800ms for a "one-by-one" feel
            setTimeout(() => {
                step.classList.add('is-active');
                
                // Update progress bar to reach this step
                const progressPercentage = (index / (steps.length - 1)) * 100;
                fill.style.width = `${progressPercentage}%`;
                
            }, index * 800); 
        });
    }
};