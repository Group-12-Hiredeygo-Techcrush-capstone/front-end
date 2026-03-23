document.addEventListener('DOMContentLoaded', () => {
    const questionsWrapper = document.getElementById('questions-wrapper');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const submitBtn = document.querySelector('.submit-btn');
    const applyMethodRadios = document.querySelectorAll('input[name="applyMethod"]');

    // --- 1. UI LOGIC: Toggle Benefit Buttons ---
    document.querySelector('.benefit-btn-box1').addEventListener('click', (e) => {
        if (e.target.classList.contains('benefit-btn')) {
            // Match the class used in your CSS (.active-benefit)
            e.target.classList.toggle('active-benefit');
        }
    });

    // --- 2. UI LOGIC: Toggle Apply Method Inputs ---
    applyMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const emailBox = document.getElementById('email-apply-container');
            const urlBox = document.getElementById('external-apply-container');
            
            emailBox.style.display = e.target.value === 'Email' ? 'block' : 'none';
            urlBox.style.display = e.target.value === 'External' ? 'block' : 'none';
        });
    });

    // --- 3. UI LOGIC: Dynamic Question Cards ---
    const renumberQuestions = () => {
        const cards = questionsWrapper.querySelectorAll('.question-card');
        cards.forEach((card, index) => {
            card.querySelector('h3').innerText = `Question ${index + 1}`;
        });
    };

    const createQuestionCard = () => {
        const count = questionsWrapper.children.length + 1;
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="card-header">
                <h3>Question ${count}</h3>
                <div class="points-box">
                    <label>Points:</label>
                    <input type="number" class="q-points" value="5" min="1" style="width: 60px;">
                </div>
                <button type="button" class="remove-btn">×</button>
            </div>
            
            <input type="text" placeholder="Type your question here" class="question-input" required>
            
            <div class="mcq-options-container" style="display: none; margin-top: 15px;">
                <label>Options (Comma separated):</label>
                <input type="text" class="q-options-input" placeholder="e.g. React, Vue, Angular">
            </div>

            <div class="answer-logic-area" style="margin-top: 15px;">
                <label>Correct Answer:</label>
                <input type="text" placeholder="The exact correct response" class="q-correct-answer" required>
            </div>

            <div class="card-footer" style="margin-top: 15px;">
                <div class="dropdown-group">
                    <label>Type:</label>
                    <select class="answer-type">
                        <option value="TEXT" selected>Short Answer</option>
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                    </select>
                </div>
            </div>
        `;
        return card;
    };

    addQuestionBtn.addEventListener('click', () => {
        questionsWrapper.appendChild(createQuestionCard());
    });

    questionsWrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            e.target.closest('.question-card').remove();
            renumberQuestions();
        }
    });

    questionsWrapper.addEventListener('change', (e) => {
        if (e.target.classList.contains('answer-type')) {
            const card = e.target.closest('.question-card');
            const optionsArea = card.querySelector('.mcq-options-container');
            optionsArea.style.display = e.target.value === 'MCQ' ? 'block' : 'none';
        }
    });

    // --- 4. API LOGIC: Sequential Submission ---
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Basic Validation Check
        const titleInput = document.getElementById('title').value;
        if (!titleInput) {
            alert("Please provide a Job Title.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Publishing Job...";

        try {
            // STEP A: Prepare Job Data
            const jobPayload = {
                companyId: "64f1a2b3c4d5e6f7a8b9c0d1", // Dynamic ID should be injected here
                title: titleInput,
                jobRole: titleInput,
                companyName: document.getElementById('companyName').value,
                category: document.getElementById('category').value,
                tags: document.getElementById('tags').value.split(',').map(t => t.trim()).filter(t => t !== ""),
                description: document.getElementById('description').value,
                requirements: document.getElementById('requirements').value,
                responsibilities: document.getElementById('responsibilities').value,
                // Match the updated .active-benefit class
                benefits: Array.from(document.querySelectorAll('.benefit-btn.active-benefit')).map(btn => btn.innerText).join(', '),
                requiredSkills: document.getElementById('requiredSkills').value.split(',').map(s => s.trim()).filter(s => s !== ""),
                type: document.getElementById('type').value,
                experienceLevel: document.getElementById('experienceLevel').value,
                experienceYears: document.getElementById('experienceYears').value,
                educationLevel: document.getElementById('educationLevel').value,
                vacancies: parseInt(document.getElementById('vacancies').value) || 1,
                salaryMin: parseInt(document.getElementById('salaryMin').value) || 0,
                salaryMax: parseInt(document.getElementById('salaryMax').value) || 0,
                salaryType: document.getElementById('salaryType').value,
                currency: "NGN",
                isSalaryNegotiable: document.getElementById('isSalaryNegotiable').value === 'true',
                country: document.getElementById('country').value,
                city: document.getElementById('city').value,
                location: document.getElementById('location').value,
                isRemote: document.getElementById('type').value === 'REMOTE',
                deadline: document.getElementById('deadline').value,
                status: "ACTIVE"
            };

            // CALL 1: POST JOB
            const jobResponse = await fetch('https://hire-dey-go-be.onrender.com/api/v1/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobPayload)
            });

            const jobResult = await jobResponse.json();
            if (!jobResponse.ok) throw new Error(jobResult.message || "Failed to create job");

            const jobId = jobResult.data?._id || jobResult.id || jobResult._id;
            submitBtn.innerText = "Creating Assessment...";

            // STEP B: Prepare Assessment Data
            const assessmentPayload = {
                title: `${jobPayload.title} Assessment`,
                description: `Technical test for the ${jobPayload.title} role at ${jobPayload.companyName}`,
                skills: jobPayload.requiredSkills,
                timeLimit: parseInt(document.getElementById('timeLimit').value) || 30,
                jobId: jobId,
                questions: Array.from(document.querySelectorAll('.question-card')).map(card => {
                    const type = card.querySelector('.answer-type').value;
                    return {
                        questionText: card.querySelector('.question-input').value,
                        type: type,
                        options: type === 'MCQ' ? card.querySelector('.q-options-input').value.split(',').map(o => o.trim()).filter(o => o !== "") : [],
                        correctAnswer: card.querySelector('.q-correct-answer').value,
                        points: parseInt(card.querySelector('.q-points').value) || 5
                    };
                })
            };

            // CALL 2: POST ASSESSMENT
            const assessResponse = await fetch('https://hire-dey-go-be.onrender.com/api/v1/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assessmentPayload)
            });

            if (assessResponse.ok) {
                alert("Success! Job and Assessment have been published.");
                window.location.href = "/dashboard";
            } else {
                const assessError = await assessResponse.json();
                throw new Error(assessError.message || "Job posted, but Assessment creation failed.");
            }

        } catch (error) {
            console.error("Submission Error:", error);
            alert("Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "Publish Job";
        }
    });
});