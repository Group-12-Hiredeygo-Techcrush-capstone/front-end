document.addEventListener('DOMContentLoaded', () => {
    console.log("Post A Job page initialized.");

    // Function to handle plan selection
    window.selectPlan = (planName) => {
        alert(`You have selected the ${planName} plan! Redirecting to payment...`);
        // Logic to redirect to a checkout page could go here
    };

    // Example: Add a hover effect or tracking to the cards
    const cards = document.querySelectorAll('.card1, .card2, .card3');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = '0.3s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});