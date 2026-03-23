document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector(".save") || document.querySelector(".finish");
    const token = localStorage.getItem("token");

    // --- SHARED UTILITY: Update the draft ---
    const updateDraft = (newData) => {
        let draft = JSON.parse(localStorage.getItem("companyProfile_Draft")) || {};
        draft = { ...draft, ...newData };
        localStorage.setItem("companyProfile_Draft", JSON.stringify(draft));
    };

    // --- PAGE 1: COMPANY INFO ---
    if (document.title.includes("Setup 1")) {
        const logoInput = document.getElementById('logoInput');
        const uploadBtn = document.getElementById('uploadBtn');
        const logoPreview = document.getElementById('logoPreview');
        const fileNameDisplay = document.getElementById('fileName');
        
        const cacInput = document.getElementById('cacInput');
        const cacBtn = document.getElementById('cacBtn');
        const cacFileNameDisplay = document.getElementById('cacFileName');

        // 1. Handle Logo Upload Trigger & Preview
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => logoInput.click());
        }

        logoInput?.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                fileNameDisplay.textContent = `Selected: ${file.name}`;

                const reader = new FileReader();
                reader.onload = (e) => {
                    logoPreview.src = e.target.result;
                    // Optional: Save base64 to draft if you want it to persist during setup
                    updateDraft({ logoBase64: e.target.result });
                };
                reader.readAsDataURL(file);
            }
        });

        // 2. Handle CAC Upload Trigger
        if (cacBtn) {
            cacBtn.addEventListener('click', () => cacInput.click());
        }

        cacInput?.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                cacFileNameDisplay.textContent = `✔ ${this.files[0].name} uploaded`;
            }
        });

        // 3. Auto-fill name if we have it from registration
        const savedName = localStorage.getItem("company_name");
        if (savedName) document.getElementById('companyName').value = savedName;

        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            updateDraft({
                name: document.getElementById('companyName').value,
                industry: document.getElementById('industry').value,
                website: document.getElementById('website').value,
                address: document.getElementById('address').value,
                teamSize: document.getElementById('teamSize').value,
                about: document.getElementById('about').value
            });
            window.location.href = "profilesetup2.html";
        });
    }

    // --- PAGE 2: FOUNDING INFO ---
    if (document.title.includes("Setup 2")) {
        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const dateVal = document.getElementById('estDate').value;
            const yearNum = dateVal ? parseInt(dateVal.split('-')[0]) : 2026;

            updateDraft({
                organizationType: document.getElementById('orgType').value, 
                yearEstablished: yearNum,
                description: document.getElementById('compVision').value 
            });
            window.location.href = "profilesetup3.html";
        });
    }

    // --- PAGE 3: SOCIAL MEDIA ---
    if (document.title.includes("Setup 3")) {
        saveBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const socialLinks = {
                facebook: document.getElementById('fb-link').value || "string",
                twitter: document.getElementById('tw-link').value || "string",
                instagram: document.getElementById('ig-link').value || "string",
                linkedin: document.getElementById('li-link').value || "string",
                youtube: "string" 
            };
            updateDraft({ socialLinks });
            window.location.href = "profilesetup4.html";
        });
    }

    // --- PAGE 4: FINAL SUBMISSION & TAGGING ---
    if (document.title.includes("Setup 4")) {
        saveBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            
            const contactInfo = {
                location: document.getElementById('mapLocation').value || "Lagos, Nigeria",
                phone: "+234" + document.getElementById('contactPhone').value,
                workEmail: document.getElementById('contactEmail').value
            };

            const draft = JSON.parse(localStorage.getItem("companyProfile_Draft"));
            const finalPayload = { ...draft, ...contactInfo };

            // Remove temporary UI-only fields before sending to API
            delete finalPayload.logoBase64; 

            saveBtn.innerText = "Creating Profile...";
            saveBtn.disabled = true;

            try {
                const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/companies", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(finalPayload)
                });

                const result = await response.json();

                if (response.ok) {
                    const companyId = result.data?._id || result._id;
                    localStorage.setItem("companyId", companyId); 
                    localStorage.removeItem("companyProfile_Draft");
                    window.location.href = "profilesetup5.html";
                } else {
                    alert("Error: " + (result.message || "Check your fields."));
                    saveBtn.disabled = false;
                    saveBtn.innerText = "Finish Setup →";
                }
            } catch (err) {
                console.error("Submission error:", err);
                alert("Server error. Please try again.");
                saveBtn.disabled = false;
            }
        });
    }
});