const mockCandidates = [
    { name: "Ajayi Temitope", loc: "Lagos, Nigeria", role: "UI/UX Designer", fit: 94 },
    { name: "Kafilat Ayinde", loc: "Abuja, Nigeria", role: "UI/UX Designer", fit: 88 },
    { name: "Bolarinwa Duro", loc: "Lagos, Nigeria", role: "Mobile Developer", fit: 82 },
    { name: "Joyce Idia", loc: "Delta, Nigeria", role: "Mobile Developer", fit: 91 }
];

function generateCard(c) {
    const initials = c.name.split(' ').map(n => n[0]).join('');
    
    // SVG Progress Calculation
    const radius = 32;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (c.fit / 100) * circ;

    const card = document.createElement('div');
    card.className = 'card'; // Frame 544
    card.innerHTML = `
        <div class="card-header-row"> <div style="display: flex; align-items: center; gap: 12px;">
                <div class="avatar-box">${initials}</div> <div class="user-meta">
                    <h3>${c.name}</h3>
                    <p>${c.loc}</p>
                </div>
            </div>
            <div class="gauge-wrap"> <svg class="gauge-svg" width="75" height="75">
                    <circle cx="37.5" cy="37.5" r="${radius}" fill="transparent" stroke="#f0f0f0" stroke-width="4"/>
                    <circle cx="37.5" cy="37.5" r="${radius}" fill="transparent" stroke="#4ade80" 
                            stroke-width="4" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
                </svg>
                <div class="fit-label">${c.fit}%<small>fit</small></div>
            </div>
        </div>
        <div class="card-actions-row"> <button class="btn-view">View Profile</button>
            <button class="btn-message">Message</button>
        </div>
    `;
    return card;
}

function initDashboard() {
    const uiuxGrid = document.getElementById('uiux');
    const mobileGrid = document.getElementById('mobile');

    mockCandidates.forEach(c => {
        const card = generateCard(c);
        if(c.role.includes("UI/UX")) uiuxGrid.appendChild(card);
        else mobileGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', initDashboard);