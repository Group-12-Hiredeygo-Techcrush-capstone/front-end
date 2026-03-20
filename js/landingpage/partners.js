/**
 * partners.js - Infinite Logo Marquee
 */
const PartnerLogos = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        const logos = [
            'netflix.png', 'amazon.png', 'spotify.png', 
            'slack.png', 'linkedin.png', 'microsoft.png'
        ];

        // Duplicate logos for seamless looping
        const logoItems = [...logos, ...logos].map(logo => `
            <div class="logo-item">
                <img src="front-end/images/partners/${logo}" alt="partner">
            </div>
        `).join('');

        target.innerHTML = `
            <section class="partners-section">
                <p class="partners-title">TRUSTED BY OVER 500+ FORWARD-THINKING COMPANIES</p>
                <div class="marquee">
                    <div class="marquee-content">
                        ${logoItems}
                    </div>
                </div>
            </section>
        `;
    }
};