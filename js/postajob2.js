/**
 * HireDeyGo | Job Posting & Assessment Engine
 * Flow: 
 * 1. Create Assessment -> 
 * 2. Create Job -> 
 * 3. Link Assessment to Job (Handshake) -> 
 * 4. Save JobID for Ranked Candidates
 */

document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = "https://hire-dey-go-be-8x3c.onrender.com";
    const submitBtn = document.querySelector('.submit-btn');
    const debugBox = document.getElementById('company-id-input');
    const questionsWrapper = document.getElementById('questions-wrapper');
    const addQuestionBtn = document.getElementById('add-question-btn');

    // UI Elements for "Apply Job on"
    const radioButtons = document.querySelectorAll('input[name="applyMethod"]');
    const emailContainer = document.getElementById('email-apply-container');
    const externalContainer = document.getElementById('external-apply-container');

    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    // --- 1. TOKEN SANITIZATION ---
    const getCleanToken = () => {
        const rawData = localStorage.getItem("token") || localStorage.getItem("HireDeyGo_UserPlanStarterauth_token");
        if (!rawData) return null;
        try {
            const parsed = JSON.parse(rawData);
            const tokenString = (parsed.tokens && parsed.tokens.accessToken) || parsed.token || rawData;
            return tokenString.replace(/"/g, "").replace(/Bearer /g, "").trim();
        } catch (e) {
            return rawData.replace(/"/g, "").replace(/Bearer /g, "").trim();
        }
    };

    // --- 2. UI TOGGLE LOGIC ---
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            emailContainer.style.display = e.target.id === 'onEmail' ? 'block' : 'none';
            externalContainer.style.display = e.target.id === 'external' ? 'block' : 'none';
        });
    });

    // --- 3. AUTOMATIC TAGGING & COMPANY SETUP ---
    const taggedCompanyId = localStorage.getItem("companyId");
    const savedCompanyName = localStorage.getItem("company_name");

    if (debugBox) {
        if (taggedCompanyId) debugBox.value = taggedCompanyId;
        debugBox.readOnly = false;
        debugBox.style.backgroundColor = "#ffffff";
        debugBox.style.cursor = "text";
    }

    // --- 4. BENEFITS MULTI-SELECT ---
    const benefitButtons = document.querySelectorAll('.benefit-btn');
    benefitButtons.forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active-benefit'));
    });

    // --- 5. DYNAMIC ASSESSMENT UI LOGIC ---
    let questionCount = 1;

    questionsWrapper.addEventListener('change', (e) => {
        if (e.target.classList.contains('answer-type')) {
            const card = e.target.closest('.question-card');
            const mcqContainer = card.querySelector('.mcq-options-container');
            mcqContainer.style.display = e.target.value === 'MCQ' ? 'block' : 'none';
        }
    });

    questionsWrapper.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const card = e.target.closest('.question-card');
            if (document.querySelectorAll('.question-card').length > 1) {
                card.remove();
                reindexQuestions();
            } else {
                alert("You must have at least one question.");
            }
        }
    });

    addQuestionBtn.addEventListener('click', () => {
        questionCount++;
        const newCard = document.createElement('div');
        newCard.className = 'question-card';
        newCard.innerHTML = `
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Question ${questionCount}</h3>
                <div class="points-box">
                    <label>Points:</label>
                    <input type="number" class="q-points" value="5" min="1" style="width: 50px;">
                </div>
                <button type="button" class="remove-btn"><i class='bx bx-x'></i></button>
            </div>
            <input type="text" placeholder="Question text..." class="question-input" required>
            <div class="mcq-options-container" style="display: none; margin-top: 15px;">
                <label>Options (Comma separated):</label>
                <input type="text" class="q-options-input" placeholder="Option A, Option B">
            </div>
            <div class="answer-logic-area" style="margin-top: 15px;">
                <label>Correct Answer:</label>
                <input type="text" placeholder="Correct response" class="q-correct-answer" required>
            </div>
            <div class="card-footer" style="margin-top: 15px;">
                <div class="dropdown-group">
                    <label>Type:</label>
                    <select class="answer-type">
                        <option value="TEXT" selected>Short Text</option>
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                    </select>
                </div>
            </div>`;
        questionsWrapper.appendChild(newCard);
    });

    function reindexQuestions() {
        const titles = questionsWrapper.querySelectorAll('h3');
        titles.forEach((title, index) => { title.innerText = `Question ${index + 1}`; });
        questionCount = titles.length;
    }

    // --- 6. SUBMIT & TRIPLE-ENDPOINT LOGIC ---
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const token = getCleanToken();
        if (!token) return alert("Please log in to publish a job.");

        // Validation Logic
        const validateAssessment = () => {
            const cards = document.querySelectorAll('.question-card');
            let isValid = true;
            let errorMessage = "";

            cards.forEach((card, index) => {
                const type = card.querySelector('.answer-type').value;
                const correctAnswer = card.querySelector('.q-correct-answer').value.trim();
                const questionText = card.querySelector('.question-input').value.trim();

                if (!questionText) {
                    isValid = false;
                    errorMessage = `Question ${index + 1} is missing the text.`;
                }

                if (type === 'MCQ') {
                    const optionsRaw = card.querySelector('.q-options-input').value;
                    const options = optionsRaw.split(',').map(o => o.trim()).filter(o => o !== "");
                    if (options.length < 2) {
                        isValid = false;
                        errorMessage = `Question ${index + 1} (MCQ) needs at least 2 options.`;
                    } else if (!options.includes(correctAnswer)) {
                        isValid = false;
                        errorMessage = `Question ${index + 1}: Correct answer must match one of the options.`;
                    }
                }
            });

            if (!isValid) alert(errorMessage);
            return isValid;
        };

        if (!validateAssessment()) return;

        const companyId = getVal('company-id-input');
        if (!companyId) return alert("Company ID is required.");

        submitBtn.disabled = true;
        
        try {
            // STEP A: CREATE ASSESSMENT
            submitBtn.innerText = "1/3: Creating Assessment...";
            const questions = Array.from(document.querySelectorAll('.question-card')).map(card => {
                const type = card.querySelector('.answer-type').value;
                return {
                    questionText: card.querySelector('.question-input').value,
                    type: type,
                    points: parseInt(card.querySelector('.q-points').value) || 5,
                    correctAnswer: card.querySelector('.q-correct-answer').value.trim(),
                    options: type === 'MCQ' ? card.querySelector('.q-options-input').value.split(',').map(o => o.trim()).filter(o => o !== "") : []
                };
            });

            const assessmentPayload = {
                title: `${getVal('title')} Skill Test`,
                description: `Technical assessment for the ${getVal('title')} role.`,
                questions: questions,
                skills: getVal('requiredSkills') ? getVal('requiredSkills').split(',').map(s => s.trim()) : ["General"],
                timeLimit: 30
            };

            const assessmentRes = await fetch(`${BASE_URL}/api/v1/assessments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(assessmentPayload)
            });

            const assessmentResult = await assessmentRes.json();
            if (!assessmentRes.ok) throw new Error(assessmentResult.message || "Failed to create assessment");
            
            // --- VIEW ASSESSMENT ID ---
            const assessmentId = assessmentResult.data?._id || assessmentResult._id || assessmentResult.id;
            console.log("%c STEP A SUCCESS: Assessment Created", "color: green; font-weight: bold;");
            console.log("Assessment ID:", assessmentId);

            // STEP B: CREATE JOB
            submitBtn.innerText = "2/3: Publishing Job...";
            const jobPayload = {
                companyId: companyId,
                title: getVal('title'),
                companyName: savedCompanyName || getVal('companyName'),
                description: getVal('description'),
                requirements: getVal('requirements'),
                benefits: Array.from(document.querySelectorAll('.benefit-btn.active-benefit')).map(btn => btn.innerText).join(', '),
                requiredSkills: getVal('requiredSkills').split(',').map(s => s.trim()),
                type: getVal('type'),
                vacancies: parseInt(getVal('vacancies')) || 1,
                location: getVal('location'),
                status: "ACTIVE"
            };

            const jobRes = await fetch(`${BASE_URL}/api/v1/jobs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(jobPayload)
            });

            const jobResult = await jobRes.json();
            if (!jobRes.ok) throw new Error(jobResult.message || "Failed to create job");
            
            // --- VIEW JOB ID ---
            const jobId = jobResult.data?._id || jobResult._id || jobResult.id;
            console.log("%c STEP B SUCCESS: Job Created", "color: green; font-weight: bold;");
            console.log("Job ID:", jobId);

            // STEP C: LINK ASSESSMENT TO JOB
            submitBtn.innerText = "3/3: Linking Test...";
            const linkRes = await fetch(`${BASE_URL}/api/v1/jobs/${jobId}/assessments/${assessmentId}`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });

            if (linkRes.ok) {
                // --- FINAL SUMMARY TABLE ---
                console.log("%c STEP C SUCCESS: Handshake Complete", "background: green; color: white; padding: 4px;");
                console.table({
                    "Action": "Workflow Completed",
                    "Job ID": jobId,
                    "Assessment ID": assessmentId,
                    "Redirecting": "success.html"
                });

                localStorage.setItem("last_created_job_id", jobId);
                localStorage.setItem("last_created_job_title", getVal('title'));
                
                // Small delay so you can actually see the console table before the redirect
                setTimeout(() => {
                    window.location.href = "success.html";
                }, 2000); 

            } else {
                throw new Error("Job created, but failed to link assessment.");
            }

        } catch (err) {
            console.error("Workflow Error:", err);
            alert("Error: " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publish Job";
        }
    });
});