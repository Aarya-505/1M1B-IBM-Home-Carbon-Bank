const UI = {
    currentUsage: document.getElementById('current-usage'),
    percentUsed: document.getElementById('percent-used'),
    predictedUsage: document.getElementById('predicted-usage'),
    progressBar: document.getElementById('progress-bar'),
    stageText: document.getElementById('stage-text'),
    pulseDot: document.getElementById('pulse-dot'),
    insightText: document.getElementById('ai-insight-text'),
    applianceList: document.getElementById('appliance-list'),
    agentLog: document.getElementById('agent-log')
};

const colors = {
    'Normal': 'var(--color-normal)',
    'Warning': 'var(--color-warning)',
    'Smart Optimization': 'var(--color-optimization)',
    'Critical': 'var(--color-critical)'
};

async function fetchState() {
    try {
        // Cache bust to always get latest JSON
        const response = await fetch('state.json?t=' + new Date().getTime());
        const state = await response.json();
        updateDashboard(state);
    } catch (error) {
        console.error("Waiting for state.json from Python simulator...", error);
    }
}

function updateDashboard(state) {
    // Top nav & progress
    UI.currentUsage.innerText = state.current_usage.toFixed(1);
    UI.predictedUsage.innerText = state.predicted_usage.toFixed(1) + ' kg';
    
    let pct = (state.current_usage / state.budget) * 100;
    pct = Math.min(pct, 100);
    UI.percentUsed.innerText = pct.toFixed(1) + '%';
    
    UI.progressBar.style.width = pct + '%';
    
    // Stage styling
    const stageColor = colors[state.stage] || colors['Normal'];
    UI.stageText.innerText = state.stage;
    UI.pulseDot.style.backgroundColor = stageColor;
    UI.pulseDot.style.boxShadow = `0 0 10px ${stageColor}`;
    UI.progressBar.style.backgroundColor = stageColor;

    // AI Insight
    UI.insightText.innerText = state.ai_insight;

    // Appliances
    UI.applianceList.innerHTML = '';
    state.appliances.forEach(app => {
        const statusClass = app.status === 'ON' ? 'status-on' : 'status-off';
        UI.applianceList.innerHTML += `
            <div class="appliance-item" style="border-left: 3px solid ${app.status === 'ON' ? stageColor : '#333'}">
                <div class="appliance-info">
                    <h4>${app.name}</h4>
                    <span class="priority-badge">${app.priority}</span>
                </div>
                <div class="appliance-stats" style="text-align: right;">
                    <div class="app-status ${statusClass}">${app.status}</div>
                    <div class="power" style="font-size: 0.85rem; color: var(--text-muted);">${app.power_w}W</div>
                </div>
            </div>
        `;
    });

    // Agent Log
    UI.agentLog.innerHTML = '';
    if(state.agent_actions.length === 0) {
        UI.agentLog.innerHTML = '<li>System monitoring active. No actions taken yet.</li>';
    } else {
        state.agent_actions.forEach(action => {
            UI.agentLog.innerHTML += `<li>${action}</li>`;
        });
    }
}

// Poll every 1.5 seconds for quick demo response
setInterval(fetchState, 1500);
fetchState(); // Initial call

// Action Button Demo
document.querySelector('.action-btn').addEventListener('click', () => {
    alert("IBM BOB: Analyzing your current metrics... generating custom optimization schedules. (This is a prototype button feature!)");
});
