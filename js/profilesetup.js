document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED UTILITIES ---
    const saveBtn = document.querySelector(".save");
    const prevBtn = document.querySelector(".previous");
    const token = localStorage.getItem("auth_token");

    // --- STEP 1: COMPANY INFO LOGIC ---
    if (document.title.includes("Profile Setup 1")) {
        const logoInput = document.getElementById("logoInput");
        const uploadBtn = document.getElementById("uploadBtn");
        const fileNameDisplay = document.getElementById("fileName");
        const logoPreview = document.querySelector(".logo-box img");
        const errorMsg = document.getElementById("errorMsg");

        // Add Remove Logo logic
        let removeBtn = document.getElementById("removeLogo");
        if (!removeBtn) {
            removeBtn = document.createElement("p");
            removeBtn.id = "removeLogo";
            removeBtn.innerText = "Remove Logo";
            removeBtn.style = "color: #e74c3c; cursor: pointer; font-size: 12px; margin-top: 5px; display: none;";
            fileNameDisplay.after(removeBtn);
        }

        // Bridge: Pull name from Registration
        const companyNameInput = document.querySelector('.left input[type="text"]:nth-of-type(1)');
        const registeredName = localStorage.getItem("company_name");
        if (registeredName && companyNameInput) {
            companyNameInput.value = registeredName;
        }

        // Logo Upload Functionality
        if (uploadBtn && logoInput) {
            uploadBtn.addEventListener("click", (e) => { e.preventDefault(); logoInput.click(); });
            
            logoInput.addEventListener("change", () => {
                const file = logoInput.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        errorMsg.textContent = "Logo must not be more than 2MB";
                        return;
                    }
                    errorMsg.textContent = "";
                    fileNameDisplay.textContent = file.name;
                    removeBtn.style.display = "block";

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        logoPreview.src = e.target.result;
                        localStorage.setItem("temp_logo_base64", e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Remove Logo Action
        removeBtn.onclick = () => {
            logoInput.value = "";
            logoPreview.src = "/images/companylogo.png";
            fileNameDisplay.textContent = "";
            removeBtn.style.display = "none";
            localStorage.removeItem("temp_logo_base64");
        };

        // CAC/Certificate Logic
        const cacBtn = document.querySelector(".browse");
        const cacStatusText = document.querySelector(".file-upload p");
        const cacInput = document.createElement("input");
        cacInput.type = "file";
        cacInput.accept = ".pdf,.doc,.docx";
        cacInput.style.display = "none";
        document.body.appendChild(cacInput);

        if (cacBtn) {
            cacBtn.addEventListener("click", (e) => { e.preventDefault(); cacInput.click(); });
            cacInput.addEventListener("change", () => {
                const file = cacInput.files[0];
                if (file) {
                    cacStatusText.textContent = `Selected: ${file.name}`;
                    cacStatusText.style.color = "#10B981";
                }
            });
        }

        // Save Step 1
        if (saveBtn) {
            saveBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const inputs = document.querySelectorAll('.left input, .left select, .right select, .right textarea');
                const data = {
                    companyName: inputs[0]?.value,
                    industry: inputs[1]?.value,
                    website: inputs[2]?.value,
                    headquarters: inputs[3]?.value,
                    companySize: inputs[4]?.value,
                    aboutCompany: inputs[5]?.value,
                    logo: localStorage.getItem("temp_logo_base64") || ""
                };
                await handleDataSave(data, "profilesetup2.html");
            });
        }
    }

    // --- STEP 2: FOUNDING INFO LOGIC ---
    if (document.title.includes("Profile Setup 2")) {
        const orgType = document.getElementById('orgType');
        const industryType = document.getElementById('industryType');
        const teamSize = document.getElementById('teamSize');
        const estDate = document.getElementById('estDate');
        const website = document.getElementById('compWebsite');
        const visionTextArea = document.getElementById('compVision');

        if (saveBtn) {
            saveBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                const step2Data = {
                    organizationType: orgType?.value,
                    industryType: industryType?.value,
                    teamSize: teamSize?.value,
                    establishedDate: estDate?.value,
                    secondaryWebsite: website?.value,
                    aboutCompany: visionTextArea?.value
                };
                await handleDataSave(step2Data, "profilesetup3.html");
            });
        }
    }

    // --- UNIVERSAL SAVE FUNCTION ---
    async function handleDataSave(newData, nextUrl) {
        saveBtn.textContent = "Saving...";
        saveBtn.disabled = true;

        let fullProfile = JSON.parse(localStorage.getItem("companyProfile_Full")) || {};
        fullProfile = { ...fullProfile, ...newData };
        localStorage.setItem("companyProfile_Full", JSON.stringify(fullProfile));

        try {
            const response = await fetch("https://hire-dey-go-be-8x3c.onrender.com/api/v1/profile/setup", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(fullProfile)
            });
            
            if (response.ok) console.log("Cloud Sync Successful");
        } catch (err) {
            console.warn("Offline: Progress saved locally.");
        }

        setTimeout(() => { window.location.href = nextUrl; }, 800);
    }

    // Navigation back
    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.history.back();
        });
    }
});