// 1. Plan Selection Logic (Available Globally)
window.selectPlan = (planName) => {
    console.log("Plan selected:", planName);
    
    // Save to localStorage so the app remembers this session's choice
    localStorage.setItem('HireDeyGo_UserPlan', planName);

    if (planName === 'Starter') {
        window.location.href = 'postajob2.html';
    } else {
        alert(`Redirecting to payment for the ${planName} plan...`);
        // Logic for Paystack would go here
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("Plans & Billing Initialized.");

    // 2. High-End Hover Effects
    const cards = document.querySelectorAll('.plan-card');
    
    cards.forEach(card => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
});