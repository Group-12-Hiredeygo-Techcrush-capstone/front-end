
const startApp = () => {
    const saveBtn = document.querySelector(".save") || document.querySelector(".finish");

    // --- 1. TOKEN RETRIEVAL LOGIC ---
    const getCleanToken = () => {
        const rawData = localStorage.getItem("token") || 
                        localStorage.getItem("HireDeyGo_UserPlanStarterauth_token") ||
                        sessionStorage.getItem("token");
        
        if (!rawData) return null;

        try {
            const parsed = JSON.parse(rawData);
            // Specifically checking the 'tokens.accessToken' path found in your backend view
            const tokenString = (parsed.tokens && parsed.tokens.accessToken) || 
                                parsed.token || 
                                parsed.accessToken || 
                                parsed.data?.token || 
                                rawData;
            
            return tokenString.replace(/"/g, "").replace(/Bearer /g, "").trim();
        } catch (e) {
            return rawData.replace(/"/g, "").replace(/Bearer /g, "").trim();
        }
    };

    const token = getCleanToken();

    // --- 2. UI COMPONENT: LOADING OVERLAY ---
    const showLoading = (message = "Processing...") => {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.8); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(5px);`;
        loader.innerHTML = `
            <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #000; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px;"></div>
            <p style="font-family: sans-serif; font-weight: 500; color: #000;">${message}</p>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`;
        document.body.appendChild(loader);
    };

    const hideLoading = () => { document.getElementById('global-loader')?.remove(); };

    // --- 3. SHARED UTILITY: Update the draft ---
    const updateDraft = (newData) => {
        let draft = JSON.parse(localStorage.getItem("companyProfile_Draft")) || {};
        draft = { ...draft, ...newData };
        localStorage.setItem("companyProfile_Draft", JSON.stringify(draft));
        console.log("HireDeyGo Draft Updated:", draft);
    };

    // --- PAGE 1: COMPANY INFO ---
    if (document.title.includes("Setup 1")) {
        const logoInput = document.getElementById('logoInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const logoPreview = document.getElementById('logoPreview');
        const cacInput = document.getElementById('cacInput');
        const cacBtn = document.getElementById('cacBtn');
        const cacFileName = document.getElementById('cacFileName');

        const draft = JSON.parse(localStorage.getItem("companyProfile_Draft"));
        if (draft) {
            if (draft.logoBase64 && logoPreview) logoPreview.src = draft.logoBase64;
            if (draft.cacName && cacFileName) cacFileName.textContent = "Attached: " + draft.cacName;
        }

        if (uploadBtn) uploadBtn.addEventListener('click', () => logoInput.click());
        logoInput?.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (logoPreview) logoPreview.src = e.target.result;
                    updateDraft({ logoBase64: e.target.result });
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        if (cacBtn) cacBtn.addEventListener('click', () => cacInput.click());
        cacInput?.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                updateDraft({ cacName: this.files[0].name });
                if (cacFileName) cacFileName.textContent = "Selected: " + this.files[0].name;
            }
        });

        saveBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            updateDraft({
                name: document.getElementById('companyName')?.value || "HireDeyGo Solutions",
                industry: document.getElementById('industry')?.value || "Technology",
                website: document.getElementById('website')?.value || "https://eclear.app",
                address: document.getElementById('address')?.value || "Lagos, Nigeria",
                teamSize: document.getElementById('teamSize')?.value || "1-10",
                about: document.getElementById('about')?.value || "Modern commerce and lifestyle management."
            });
            window.location.href = "profilesetup2.html";
        });
    }

    // --- PAGE 2 & 3: FOUNDING & SOCIAL ---
    if (document.title.includes("Setup 2")) {
        saveBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            const dateVal = document.getElementById('estDate')?.value;
            updateDraft({
                organizationType: (document.getElementById('orgType')?.value || "STARTUP").toUpperCase(), 
                yearEstablished: dateVal ? parseInt(dateVal.split('-')[0]) : 2026,
                description: document.getElementById('compVision')?.value || "Vision Statement"
            });
            window.location.href = "profilesetup3.html";
        });
    }

    if (document.title.includes("Setup 3")) {
        saveBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            updateDraft({
                socialLinks: {
                    linkedin: document.getElementById('li-link')?.value || "",
                    twitter: document.getElementById('tw-link')?.value || "",
                    facebook: document.getElementById('fb-link')?.value || "",
                    instagram: document.getElementById('ig-link')?.value || "",
                    youtube: "" 
                }
            });
            window.location.href = "profilesetup4.html";
        });
    }

    // --- PAGE 4: FINAL SUBMISSION ---
    if (document.title.includes("Setup 4")) {
        saveBtn?.addEventListener("click", async (e) => {
            e.preventDefault();
            const draft = JSON.parse(localStorage.getItem("companyProfile_Draft")) || {};

            if (!token) {
                console.error("Auth Error: Valid token not found.");
                alert("Session expired. Please verify your email again.");
                return;
            }

            const textPayload = { 
                name: draft.name,
                about: draft.about,
                description: draft.description || draft.about || "Company description",
                address: draft.address,
                website: draft.website,
                phone: document.getElementById('contactPhone')?.value || "+2348000000000",
                workEmail: document.getElementById('contactEmail')?.value || "admin@HireDeyGo.app",
                industry: draft.industry,
                organizationType: draft.organizationType,
                teamSize: draft.teamSize,
                yearEstablished: draft.yearEstablished,
                location: document.getElementById('mapLocation')?.value || draft.address,
                socialLinks: draft.socialLinks
            };

            showLoading("Finalizing HireDeyGo Recruiter's Profile...");
            saveBtn.disabled = true;

            try {
                // STEP 1: POST Text Data
                const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/companies", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify(textPayload)
                });

                const result = await response.json();

                if (response.ok) {
                    const companyId = result.data?._id || result._id;
                    
                    // STEP 2: PATCH Logo (Only if successful and logo exists)
                    if (draft.logoBase64 && companyId) {
                        showLoading("Uploading Brand Assets...");
                        try {
                            const blob = await (await fetch(draft.logoBase64)).blob();
                            const formData = new FormData();
                            formData.append("logo", blob, "logo.png");

                            await fetch(`https://hire-dey-go-be-8x3c.onrender.com/api/v1/companies/${companyId}/logo`, {
                                method: "PATCH",
                                headers: { "Authorization": `Bearer ${token}` },
                                body: formData
                            });
                        } catch (logoErr) {
                            console.error("Logo upload failed, but profile was created.", logoErr);
                        }
                    }

                    localStorage.removeItem("companyProfile_Draft");
                    window.location.href = "profilesetup5.html";
                } else {
                    hideLoading();
                    alert("Submission failed: " + (result.message || "Unauthorized access."));
                    saveBtn.disabled = false;
                }
            } catch (err) {
                hideLoading();
                alert("Network Error: Could not reach server.");
                saveBtn.disabled = false;
            }
        });
    }
};

// Start logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}