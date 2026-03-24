const SuccessCTA = {
    render(containerId) {
        const mount = document.getElementById(containerId);
        if (!mount) return;

        mount.innerHTML = `
            <section class="success-cta-wrapper">
                <div class="success-cta-card">
                    <div class="success-content">
                        <span class="badge-green">Join the Elite</span>
                        <h2 class="success-title">Ready to hire your next <br>high-impact team member?</h2>
                        <p class="success-text">Join 50,000+ companies using our AI-driven platform to scale their teams faster.</p>
                        <div class="cta-button-group">
                            <button class="btn-primary-green">Get Started Now</button>
                            <button class="btn-secondary-white">Schedule a Demo</button>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};