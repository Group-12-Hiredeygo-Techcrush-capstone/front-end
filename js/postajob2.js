document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('.submit-btn');
    const debugBox = document.getElementById('company-id-input'); 
    const questionsWrapper = document.getElementById('questions-wrapper');
    const addQuestionBtn = document.getElementById('add-question-btn');
    
    // UI Elements for "Apply Job on"
    const radioButtons = document.querySelectorAll('input[name="applyMethod"]');
    const emailContainer = document.getElementById('email-apply-container');
    const externalContainer = document.getElementById('external-apply-container');

    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    // --- 1. UI TOGGLE LOGIC (Apply Methods) ---
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            emailContainer.style.display = e.target.id === 'onEmail' ? 'block' : 'none';
            externalContainer.style.display = e.target.id === 'external' ? 'block' : 'none';
        });
    });

    // --- 2. AUTOMATIC TAGGING ---
    const taggedCompanyId = localStorage.getItem("companyId");
    const savedCompanyName = localStorage.getItem("company_name");

    if (debugBox) {
        if (taggedCompanyId) debugBox.value = taggedCompanyId;
        debugBox.readOnly = false;
        debugBox.style.backgroundColor = "#ffffff"; 
        debugBox.style.cursor = "text";
    }

    // --- 3. BENEFITS MULTI-SELECT ---
    const benefitButtons = document.querySelectorAll('.benefit-btn');
    benefitButtons.forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active-benefit'));
    });

    // --- 4. DYNAMIC ASSESSMENT LOGIC ---
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

    // --- 5. SUBMIT & TWO-ENDPOINT LOGIC ---
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // VALIDATION CHECK
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
                        errorMessage = `Question ${index + 1}: Correct answer must match one of the options exactly.`;
                    }
                }
            });

            if (!isValid) alert(errorMessage);
            return isValid;
        };

        if (!validateAssessment()) return;

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const companyId = getVal('company-id-input');

        if (!companyId) return alert("Company ID is required.");

        submitBtn.disabled = true;
        submitBtn.innerText = "Processing Assessment...";

        try {
            // STEP A: Create Assessment
            const questions = Array.from(document.querySelectorAll('.question-card')).map(card => {
                const type = card.querySelector('.answer-type').value;
                return {
                    questionText: card.querySelector('.question-input').value,
                    type: type,
                    points: parseInt(card.querySelector('.q-points').value) || 0,
                    correctAnswer: card.querySelector('.q-correct-answer').value.trim(),
                    options: type === 'MCQ' ? card.querySelector('.q-options-input').value.split(',').map(o => o.trim()) : []
                };
            });

            const assessmentPayload = {
                title: `${getVal('title')} Assessment`,
                description: `Skill test for ${getVal('title')}`,
                skills: getVal('requiredSkills').split(',').map(s => s.trim()),
                timeLimit: parseInt(getVal('timeLimit')) || 30,
                questions: questions
            };

            const assessmentRes = await fetch('https://hire-dey-go-be-8x3c.onrender.com/api/v1/assessments', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': token ? `Bearer ${token}` : "" 
                },
                body: JSON.stringify(assessmentPayload)
            });

            if (!assessmentRes.ok) {
                const errData = await assessmentRes.json();
                throw new Error(errData.message || "Failed to create assessment");
            }

            const assessmentResult = await assessmentRes.json();
            const assessmentId = assessmentResult.data?._id || assessmentResult._id || assessmentResult.id;

            submitBtn.innerText = "Publishing Job...";

            // STEP B: Create Job
            const jobPayload = {
                companyId: companyId,
                title: getVal('title'),
                jobRole: getVal('title'),
                companyName: savedCompanyName || getVal('companyName'),
                category: getVal('category'),
                tags: getVal('tags').split(',').map(t => t.trim()),
                description: getVal('description'),
                requirements: getVal('requirements'),
                responsibilities: getVal('responsibilities'),
                benefits: Array.from(document.querySelectorAll('.benefit-btn.active-benefit')).map(btn => btn.innerText).join(', '),
                requiredSkills: getVal('requiredSkills').split(',').map(s => s.trim()),
                type: getVal('type'),
                experienceLevel: getVal('experienceLevel'),
                experienceYears: getVal('experienceYears'),
                educationLevel: getVal('educationLevel'),
                vacancies: parseInt(getVal('vacancies')) || 1,
                salaryMin: parseInt(getVal('salaryMin')) || 0,
                salaryMax: parseInt(getVal('salaryMax')) || 0,
                salaryType: getVal('salaryType'),
                isSalaryNegotiable: getVal('isSalaryNegotiable') === "true",
                country: getVal('country'),
                city: getVal('city'),
                location: getVal('location'),
                deadline: getVal('deadline'),
                assessmentId: assessmentId,
                status: "ACTIVE"
            };

            const jobRes = await fetch('https://hire-dey-go-be-8x3c.onrender.com/api/v1/jobs', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': token ? `Bearer ${token}` : "" 
                },
                body: JSON.stringify(jobPayload)
            });

            if (jobRes.ok) {
                window.location.href = "success.html";
            } else {
                const jobError = await jobRes.json();
                alert("Job Post Failed: " + (jobError.message || "Unknown error"));
            }

        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publish Job";
        }
    });
});