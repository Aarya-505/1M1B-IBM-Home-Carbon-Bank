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
        // If it fails, the python script isn't running
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
    let newApplianceHTML = '';
    state.appliances.forEach(app => {
        const statusClass = app.status === 'ON' ? 'status-on' : 'status-off';
        newApplianceHTML += `
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
    if (UI.applianceList.innerHTML.trim() !== newApplianceHTML.trim()) {
        UI.applianceList.innerHTML = newApplianceHTML;
    }

    // Agent Log
    let newLogHTML = '';
    if(state.agent_actions.length === 0) {
        newLogHTML = '<li>System monitoring active. No actions taken yet.</li>';
    } else {
        state.agent_actions.forEach(action => {
            newLogHTML += `<li>${action}</li>`;
        });
    }
    if (UI.agentLog.innerHTML.trim() !== newLogHTML.trim()) {
        UI.agentLog.innerHTML = newLogHTML;
    }
}

// Poll every 1.5 seconds for quick demo response
setInterval(fetchState, 1500);
fetchState(); // Initial call

// Action Button Demo (More Interactive)
document.querySelector('.action-btn').addEventListener('click', (e) => {
    const btn = e.target;
    
    // Check if we already have results showing
    if(document.querySelector('.action-results')) {
        document.querySelector('.action-results').remove();
    }

    // Button animation
    btn.innerText = "IBM BOB is analyzing...";
    btn.style.backgroundColor = "#f59e0b"; // warning color while thinking
    btn.disabled = true;
    
    // Simulate API delay for AI generation
    setTimeout(() => {
        btn.innerText = "Take Carbon Action";
        btn.style.backgroundColor = "#38bdf8"; // back to normal
        btn.disabled = false;

        const results = document.createElement('div');
        results.className = 'action-results';
        results.innerHTML = `
            <h4 style="color: #38bdf8; margin-bottom: 0.5rem;">💡 Generated Actions</h4>
            <ul style="list-style: none; padding-left: 0; font-size: 0.95rem; color: #e2e8f0; line-height: 1.5;">
                <li style="margin-bottom: 0.5rem;">🟢 <strong>Air Conditioner:</strong> Switch to Eco-Mode (Saves ~12 kg CO₂e)</li>
                <li style="margin-bottom: 0.5rem;">🟢 <strong>Water Heater:</strong> Delay usage until off-peak hours (Saves ~5 kg CO₂e)</li>
                <li>🟢 <strong>Decorative Lights:</strong> Turn off immediately (Saves ~2 kg CO₂e)</li>
            </ul>
        `;
        
        // Append below the button
        btn.parentNode.appendChild(results);
    }, 2000); // 2 second delay
});
