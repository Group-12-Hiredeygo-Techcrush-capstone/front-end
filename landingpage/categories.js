/**
 * categories.js - Popular Job Categories Implementation
 */
const JobCategories = {
    render(containerId) {
        const target = document.getElementById(containerId);
        if (!target) return;

        const categories = [
            { title: 'Software Engineering', count: '4.5k+ Positions', color: '#7311D4', icon: 'code' },
            { title: 'Product Design', count: '2.1k+ Positions', color: '#22C55E', icon: 'palette' },
            { title: 'Marketing', count: '1.8k+ Positions', color: '#7311D4', icon: 'megaphone' },
            { title: 'Data Science', count: '3.2k+ Positions', color: '#22C55E', icon: 'bar-chart' }
        ];

        target.innerHTML = `
            <section class="categories-section">
                <div class="categories-container">
                    <div class="categories-header">
                        <div class="header-text">
                            <h2 class="cat-title">Popular Categories</h2>
                            <p class="cat-subtitle">Browse the most in-demand roles right now.</p>
                        </div>
                        <a href="#" class="view-all-link">
                            View All 
                            <span class="arrow-icon">→</span>
                        </a>
                    </div>

                    <div class="categories-grid">
                        ${categories.map(cat => `
                            <div class="category-card">
                                <div class="cat-icon-box" style="background: ${cat.color}"></div>
                                <div class="cat-info">
                                    <h4 class="cat-name">${cat.title}</h4>
                                    <p class="cat-count">${cat.count}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }
};