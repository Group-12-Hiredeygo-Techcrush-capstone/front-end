/**
 * partners.js - Infinite Logo Marquee (Enhanced Size)
 */
const PartnerLogos = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        const logos = [
            'netflix.webp', 'paystack.webp', 'glovo.png', 
            'nnpc.png', 'techcrush.png', 'microsoft.jpg'
        ];

        // Tripled for extra-wide screens to prevent gaps
        const logoItems = [...logos, ...logos, ...logos].map(logo => `
            <div class="logo-item">
                <img src="images/${logo}" alt="${logo}" 
                     style="height: 48px; width: auto; opacity: 0.5; filter: grayscale(100%); transition: all 0.4s ease;">
            </div>
        `).join('');

        target.innerHTML = `
            <section class="partners-section" style="padding: 100px 0; background: #fff;">
                <div class="partners-container">
                    <p class="partners-title" style="margin-bottom: 60px;">TRUSTED BY OVER 500+ FORWARD-THINKING COMPANIES</p>
                    <div class="marquee-viewport">
                        <div class="marquee-content" style="gap: 120px;">
                            ${logoItems}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
};