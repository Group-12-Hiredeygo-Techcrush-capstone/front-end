
const HeroSection = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        target.innerHTML = `
            <div class="hero-wrapper">
                
                <div class="hero-content-stack">
                    <div class="hero-badge-f">
                        New : <span style="color: #7F13EC; margin-left: 4px;">5,000+ jobs added this week</span>
                    </div>
                    
                    <h1 class="hero-h1-f">
                        Hire Smarter. <br>
                        <span>Grow Faster.</span>
                    </h1>
                    
                    <p class="hero-p-f">
                        The all-in-one recruitment platform that helps employers find, evaluate, and hire top talent across every industry.
                    </p>

                    <div class="hero-search-f">
                        <div style="display: flex; align-items: center; flex: 1.2; padding: 0 16px; border-right: 1px solid #E2E8F0;">
                            <img src="images/search.png" alt="search" style="width: 18px;">
                            <input type="text" placeholder="Search by skill, role or keywords" 
                                style="border: none; outline: none; width: 100%; margin-left: 10px; font-family: 'Montserrat'; font-size: 14px;">
                        </div>
                        
                        <div style="display: flex; align-items: center; flex: 1; padding: 0 16px;">
                            <img src="images/location.png" alt="loc" style="width: 16px;">
                            <input type="text" placeholder="City or remote" 
                                style="border: none; outline: none; width: 100%; margin-left: 10px; font-family: 'Montserrat'; font-size: 14px;">
                        </div>
                        
                        <button style="background: #7F13EC; color: white; border: none; border-radius: 8px; width: 120px; height: 52px; font-family: 'Montserrat'; font-weight: 700; cursor: pointer;">
                            Find A Candidate
                        </button>
                    </div>

                    <div class="hero-social-proof">
                        <div class="avatar-stack">
                            <div class="avatar-f" style="background-image: url('images/prof.webp');"></div>
                            <div class="avatar-f" style="background-image: url('images/prof.webp');"></div>
                            <div class="avatar-f" style="background-image: url('images/prof.webp');"></div>
                        </div>
                        <div class="social-proof-text">
                            12k+ professionals already joined
                        </div>
                    </div>
                </div>

                <div class="hero-visual-f">
                    <div class="blur-green"></div>
                    <div class="blur-purple"></div>

                    <div class="hero-img-container">
                        <div class="hero-border-layer"></div>
                        
                        <img src="images/prof.webp" class="hero-main-img" alt="Professional">
                        
                        <div class="hero-floating-f">
                            <img src="images/growth.png" alt="success" 
                                 style="width: 48px; height: 48px; margin-right: 16px; object-fit: contain;">
                            
                            <div>
                                <p style="margin: 0; font-family: 'Lexend'; font-weight: 700; font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.8px;">
                                    Success Rate
                                </p>
                                <p style="margin: 0; font-family: 'Lexend'; font-weight: 900; font-size: 22px; color: #020617; line-height: 1.2;">
                                    98.4% Matched
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }
};