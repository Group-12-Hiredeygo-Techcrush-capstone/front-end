/**
 * stats.js - Figma Metric Bar with Count-Up Animation
 */
const StatsSection = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        target.innerHTML = `
            <section class="stats-outer-frame">
                <div class="stats-inner-container">
                    
                    <div class="stat-group">
                        <div class="stat-value color-purple" data-target="1.7" data-suffix="M+">0</div>
                        <div class="stat-label">Active Candidates</div>
                    </div>

                    <div class="stat-group">
                        <div class="stat-value color-green" data-target="50" data-suffix="k+">0</div>
                        <div class="stat-label">Top Companies</div>
                    </div>

                    <div class="stat-group">
                        <div class="stat-value color-dark" data-target="10" data-suffix="k+">0</div>
                        <div class="stat-label">Successful Hires</div>
                    </div>

                    <div class="stat-group">
                        <div class="stat-value color-purple" data-target="150" data-suffix="+">0</div>
                        <div class="stat-label">Countries</div>
                    </div>

                </div>
            </section>
        `;

        this.initAnimations();
    },

    initAnimations() {
        const stats = document.querySelectorAll('.stat-value');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    },

    animateCount(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix');
        const duration = 2000; // 2 seconds
        const frameRate = 1000 / 60;
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;

        const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            // Ease-out function for smooth finish
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = (target * easeOut).toFixed(target % 1 === 0 ? 0 : 1);
            
            el.innerText = currentVal + suffix;

            if (currentFrame === totalFrames) {
                el.innerText = target + suffix;
                clearInterval(counter);
            }
        }, frameRate);
    }
};