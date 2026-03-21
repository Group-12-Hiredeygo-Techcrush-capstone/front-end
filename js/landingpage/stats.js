/**
 * stats.js - High-Fidelity Figma Spec
 */
const StatsSection = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        
target.innerHTML = `
    <section class="stats-outer-frame">
        <div class="stats-inner-container">
            
            <div class="stat-group">
                <div class="stat-value" data-target="1.7" data-suffix="M+">0</div>
                <div class="stat-label">Active Candidates</div>
            </div>

            <div class="stat-group">
                <div class="stat-value" data-target="50" data-suffix="k+">0</div>
                <div class="stat-label">Top Companies</div>
            </div>

            <div class="stat-group">
                <div class="stat-value" data-target="10" data-suffix="k+">0</div>
                <div class="stat-label">Successful Hires</div>
            </div>

            <div class="stat-group">
                <div class="stat-value" data-target="150" data-suffix="+">0</div>
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
        }, { threshold: 0.2 });

        stats.forEach(stat => observer.observe(stat));
    },

    animateCount(el) {
        const targetValue = parseFloat(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix');
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Professional ease-out for that "premium" feel
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = (easeOut * targetValue).toFixed(targetValue % 1 === 0 ? 0 : 1);
            
            el.innerText = current + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }
};