const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
const ENDPOINT = "/api/v1/applications";

const uiuxContainer = document.getElementById("uiux");
const mobileContainer = document.getElementById("mobile");

async function fetchCandidates() {
  try {
    const res = await fetch(`${BASE_URL}${ENDPOINT}`);
    const data = await res.json();

    console.log(data);

    renderCandidates(data.data || data);
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
}

function renderCandidates(candidates) {
  uiuxContainer.innerHTML = "";
  mobileContainer.innerHTML = "";

  candidates.forEach(candidate => {
    const card = createCard(candidate);

    // Simple grouping logic
    if (candidate.role?.toLowerCase().includes("ui")) {
      uiuxContainer.appendChild(card);
    } else {
      mobileContainer.appendChild(card);
    }
  });
}

function createCard(candidate) {
  const div = document.createElement("div");
  div.classList.add("card");

  const initials = getInitials(candidate.name);
  const skills = candidate.skills || [];
  const fit = candidate.fit || Math.floor(Math.random() * 20 + 80);

  div.innerHTML = `
    <div class="card-header">
      <div class="avatar">${initials}</div>
      <div>
        <div class="name">${candidate.name}</div>
        <div class="location">${candidate.location || "Nigeria"}</div>
      </div>
    </div>

    <div class="progress">${fit}%</div>

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

function getInitials(name) {
  return name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

// Init
fetchCandidates();