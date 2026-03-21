document.addEventListener('DOMContentLoaded', () => {
    // 1. Toggle Action Popups
    const dotsIcons = document.querySelectorAll('.bx-dots-vertical-rounded');
    
    dotsIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const popup = e.currentTarget.nextElementSibling;
            
            if (popup && popup.classList.contains('application-popup')) {
                // Close all other open popups
                document.querySelectorAll('.application-popup').forEach(p => {
                    if (p !== popup) p.style.display = 'none';
                });
                
                // Toggle current popup
                const isVisible = popup.style.display === 'flex';
                popup.style.display = isVisible ? 'none' : 'flex';
            }
            e.stopPropagation();
        });
    });

    // Close popups when clicking anywhere else
    document.addEventListener('click', () => {
        document.querySelectorAll('.application-popup').forEach(p => {
            p.style.display = 'none';
        });
    });

    console.log("Dashboard UI Logic Initialized.");
});