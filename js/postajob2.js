document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('.submit-btn');
    const debugBox = document.getElementById('debug-company-id');
    const questionsWrapper = document.getElementById('questions-wrapper');
    const addQuestionBtn = document.getElementById('add-question-btn');
    
    const getVal = (id) => document.getElementById(id)?.value.trim() || "";

    // --- 1. AUTOMATIC TAGGING & UI LOCK ---
    const taggedCompanyId = localStorage.getItem("companyId");
    const savedCompanyName = localStorage.getItem("company_name");

    if (debugBox && taggedCompanyId) {
        debugBox.value = taggedCompanyId;
        debugBox.readOnly = true;
        debugBox.style.backgroundColor = "#f1effc"; 
        debugBox.style.cursor = "not-allowed";
    }

    // --- 2. JOB BENEFITS LOGIC (Multi-select) ---
    const benefitButtons = document.querySelectorAll('.benefit-btn');
    benefitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active-benefit');
        });
    });

    // --- 3. DYNAMIC ASSESSMENT QUESTIONS LOGIC ---
    let questionCount = 1;

    // Toggle MCQ Options Visibility
    questionsWrapper.addEventListener('change', (e) => {
        if (e.target.classList.contains('answer-type')) {
            const card = e.target.closest('.question-card');
            const mcqContainer = card.querySelector('.mcq-options-container');
            if (e.target.value === 'MCQ') {
                mcqContainer.style.display = 'block';
            } else {
                mcqContainer.style.display = 'none';
            }
        }
    });

    // Remove Question
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

    // Add New Question Template
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
            <input type="text" placeholder="e.g. What is the output of 2 + 2?" class="question-input" required>
            <div class="mcq-options-container" style="display: none; margin-top: 15px;">
                <label>Options (Comma separated):</label>
                <input type="text" class="q-options-input" placeholder="e.g. Option A, Option B, Option C">
            </div>
            <div class="answer-logic-area" style="margin-top: 15px;">
                <label>Correct Answer:</label>
                <input type="text" placeholder="The exact correct response" class="q-correct-answer" required>
            </div>
            <div class="card-footer" style="margin-top: 15px;">
                <div class="dropdown-group">
                    <label>Type:</label>
                    <select class="answer-type">
                        <option value="TEXT" selected>Short Text</option>
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                    </select>
                </div>
            </div>
        `;
        questionsWrapper.appendChild(newCard);
    });

    function reindexQuestions() {
        const titles = questionsWrapper.querySelectorAll('h3');
        titles.forEach((title, index) => {
            title.innerText = `Question ${index + 1}`;
        });
        questionCount = titles.length;
    }

    // --- 4. SUBMIT & DATA COLLECTION ---
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const companyId = taggedCompanyId || getVal('debug-company-id');

        if (!token || !companyId) {
            alert("Verification failed. Please ensure you are logged in and company profile is ready.");
            return;
        }

        // Collect Selected Benefits
        const selectedBenefits = Array.from(document.querySelectorAll('.benefit-btn.active-benefit'))
                                      .map(btn => btn.innerText);

        // Collect Assessment Data
        const questions = Array.from(document.querySelectorAll('.question-card')).map(card => {
            return {
                questionText: card.querySelector('.question-input').value,
                type: card.querySelector('.answer-type').value,
                points: parseInt(card.querySelector('.q-points').value),
                correctAnswer: card.querySelector('.q-correct-answer').value,
                options: card.querySelector('.answer-type').value === 'MCQ' 
                         ? card.querySelector('.q-options-input').value.split(',').map(o => o.trim()) 
                         : []
            };
        });

        submitBtn.disabled = true;
        submitBtn.innerText = "Publishing Job...";

        try {
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
                benefits: selectedBenefits.join(', '), 
                requiredSkills: getVal('requiredSkills').split(',').map(s => s.trim()),
                type: getVal('type'),
                experienceLevel: getVal('experienceLevel'),
                experienceYears: getVal('experienceYears'),
                educationLevel: getVal('educationLevel'),
                vacancies: parseInt(getVal('vacancies')),
                salaryMin: parseInt(getVal('salaryMin')),
                salaryMax: parseInt(getVal('salaryMax')),
                salaryType: getVal('salaryType'),
                isSalaryNegotiable: getVal('isSalaryNegotiable') === "true",
                country: getVal('country'),
                city: getVal('city'),
                location: getVal('location'),
                deadline: getVal('deadline'),
                assessment: {
                    timeLimit: parseInt(getVal('timeLimit')),
                    questions: questions
                },
                status: "ACTIVE"
            };

            const response = await fetch('https://hire-dey-go-be.onrender.com/api/v1/jobs', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(jobPayload)
            });

            if (response.ok) {
                alert("Job successfully published!");
                window.location.href = "recruitersdashboard.html";
            } else {
                const result = await response.json();
                alert("Error: " + (result.message || "Failed to post job."));
            }
        } catch (error) {
            alert("Network error. Please try again later.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publish Job";
        }
    });
});