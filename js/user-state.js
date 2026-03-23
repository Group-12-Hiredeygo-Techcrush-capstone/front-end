const UserState = {
    // Check if user has a plan
    hasActivePlan: () => {
        const plan = localStorage.getItem('HireDeyGo_UserPlan');
        return plan && plan !== 'none';
    },

    // Get current plan name
    getPlan: () => localStorage.getItem('HireDeyGo_UserPlan') || 'none',

    // Function to handle the "Post a Job" click
    handlePostJobRequest: () => {
        if (UserState.hasActivePlan()) {
            window.location.href = 'postajob2.html';
        } else {
            window.location.href = 'plans&billing.html';
        }
    }
};