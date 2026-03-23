/**
 * HireDeyGo | Saved Candidates Logic
 * Integrated with global-nav.js and API-first architecture
 */

const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
const ENDPOINT = "/api/v1/applications";

// Containers
const uiuxContainer = document.getElementById("uiux");
const mobileContainer = document.getElementById("mobile");
const searchInput = document.getElementById("candidateSearch");
const sortSelect = document.getElementById("sortSelect");

let allCandidates = []; // Global store for filtering/sorting

/**
 * 1. FETCH DATA
 */
async function fetchCandidates() {
    try {
        const res = await fetch(`${BASE_URL}${ENDPOINT}`);
        const data = await res.json();
        
        // Handle different API response structures
        allCandidates = data.data || data;
        
        console.log("Candidates Loaded:", allCandidates);
        renderCandidates(allCandidates);
    } catch (error) {
        console.error("Error fetching candidates:", error);
    }
}

/**
 * 2. RENDER LOGIC
 */
function renderCandidates(candidates) {
    if (!uiuxContainer || !mobileContainer) return;

    // Clear current grids
    uiuxContainer.innerHTML = "";
    mobileContainer.innerHTML = "";

    candidates.forEach(candidate => {
        const card = createCard(candidate);

        // Grouping Logic: UI/UX vs Mobile
        const role = candidate.role?.toLowerCase() || "";
        if (role.includes("ui") || role.includes("ux") || role.includes("design")) {
            uiuxContainer.appendChild(card);
        } else {
            mobileContainer.appendChild(card);
        }
    });

    // Handle empty states
    checkEmptyState(uiuxContainer, "No UI/UX designers found.");
    checkEmptyState(mobileContainer, "No mobile developers found.");
}

/**
 * 3. CREATE CARD COMPONENT (Naked Highlight Style)
 */
function createCard(candidate) {
    const div = document.createElement("div");
    div.classList.add("card");

    const initials = getInitials(candidate.name || "User");
    const skills = candidate.skills || ["General"];
    const fit = candidate.fit || Math.floor(Math.random() * 20 + 80);
    
    // Dynamic color for the fit percentage
    const fitColor = fit >= 90 ? "#10B981" : "#7F13EC";

    div.innerHTML = `
        <div class="card-header">
            <div class="avatar">${initials}</div>
            <div>
                <div class="name">${candidate.name}</div>
                <div class="location"><i class='bx bx-map'></i> ${candidate.location || "Nigeria"}</div>
            </div>
        </div>

        <div class="progress" style="border-color: ${fitColor}; color: ${fitColor};">
            ${fit}%
        </div>

        <div class="tags">
            ${skills.map(skill => `<span class="tag">${skill}</span>`).join("")}
        </div>

        <div class="actions">
            <button class="btn view">View Profile</button>
            <button class="btn message">Message</button>
        </div>
    `;

    return div;
}

/**
 * 4. SEARCH & FILTERING
 */
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allCandidates.filter(c => 
            c.name.toLowerCase().includes(term) || 
            (c.role && c.role.toLowerCase().includes(term))
        );
        renderCandidates(filtered);
    });
}

/**
 * 5. SORTING
 */
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const criteria = e.target.value;
        let sorted = [...allCandidates];

        if (criteria === "Newest") {
            sorted.reverse(); // Assuming API returns oldest first, or sort by date if available
        } else if (criteria === "Oldest") {
            // Keep original order
        }
        renderCandidates(sorted);
    });
}

/**
 * UTILS
 */
function getInitials(name) {
    return name
        ?.split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

function checkEmptyState(container, message) {
    if (container.children.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; color: #888; padding: 2rem;">${message}</p>`;
    }
}

// Initial Load
fetchCandidates();