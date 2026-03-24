const TopCandidates = {
    candidates: [
        {
            name: "Sarah Chen",
            role: "Senior Fullstack Engineer",
            skills: ["React", "Node.js", "AWS", "Python"],
            experience: "8+ Years",
            featured: false,
            avatar: "assets/sarah.jpg"
        },
        {
            name: "Marcus Thorne",
            role: "Lead Product Designer",
            skills: ["Figma", "Design Ops", "UX Research"],
            experience: "12+ Years",
            featured: true,
            avatar: "assets/marcus.jpg"
        },
        {
            name: "Elena Rodriguez",
            role: "Growth Marketing Manager",
            skills: ["SEO", "Hubspot", "Ads"],
            experience: "5+ Years",
            featured: false,
            avatar: "assets/elena.jpg"
        }
    ],

    render(containerId) {
        const mount = document.getElementById(containerId);
        if (!mount) return;

        mount.innerHTML = `
            <section class="top-candidates-section">
                <div class="top-candidates-header">
                    <h2 class="top-candidates-title">Top Candidates This Week</h2>
                    <p class="top-candidates-subtitle">Hand-picked, high-signal candidates ready for their next challenge.</p>
                </div>

                <div class="candidates-container">
                    ${this.candidates.map(candidate => `
                        <article class="candidate-card ${candidate.featured ? 'featured' : ''}">
                            <div class="card-header-row">
                                <div class="candidate-avatar" style="background-image: url('${candidate.avatar}')"></div>
                                <div class="candidate-name-stack">
                                    <h4>${candidate.name} ${candidate.featured ? '<span class="verified-indicator"></span>' : ''}</h4>
                                    <div class="candidate-role">${candidate.role}</div>
                                </div>
                            </div>
                            
                            <div class="tags-row">
                                ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>

                            <div class="card-footer-row">
                                <div class="exp-container">
                                    <div class="exp-label">Experience</div>
                                    <div class="exp-value">${candidate.experience}</div>
                                </div>
                                <button class="btn-view-profile" onclick="viewCandidate('${candidate.name}')">View Profile</button>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </section>
        `;
    }
};

window.viewCandidate = (name) => {
    console.log(`Opening profile for: ${name}`);
};