import json
import time
import random
import os

# Constants
BUDGET_CO2E = 300.0
STATE_FILE = "state.json"

# Initial state
state = {
    "budget": BUDGET_CO2E,
    "current_usage": 180.0,
    "predicted_usage": 195.0,
    "stage": "Normal",
    "appliances": [
        {"name": "Air Conditioner", "power_w": 1500, "status": "ON", "priority": "Important", "co2e_contrib": 45.0},
        {"name": "Refrigerator", "power_w": 400, "status": "ON", "priority": "Essential", "co2e_contrib": 30.0},
        {"name": "Water Heater", "power_w": 2000, "status": "OFF", "priority": "Important", "co2e_contrib": 20.0},
        {"name": "Gaming PC", "power_w": 600, "status": "ON", "priority": "Non-Essential", "co2e_contrib": 25.0},
        {"name": "Washing Machine", "power_w": 1000, "status": "OFF", "priority": "Important", "co2e_contrib": 15.0},
        {"name": "Decorative Lights", "power_w": 100, "status": "ON", "priority": "Non-Essential", "co2e_contrib": 15.0}
    ],
    "ai_insight": "Usage is normal. Keep it up!",
    "agent_actions": []
}

def write_state():
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=4)

def simulate_tick():
    # Randomly increase usage to simulate time passing quickly for the demo
    increase = random.uniform(2.0, 8.0)
    state["current_usage"] += increase
    
    # Prediction assumes current rate continues aggressively
    state["predicted_usage"] = state["current_usage"] * 1.15

    pct_used = (state["current_usage"] / state["budget"]) * 100

    # Agentic Logic State Machine
    if pct_used < 70:
        state["stage"] = "Normal"
        state["ai_insight"] = "Your household energy consumption is looking good. You are on track to stay within your carbon budget."
    
    elif 70 <= pct_used < 85:
        if state["stage"] != "Warning":
            state["stage"] = "Warning"
            state["agent_actions"].insert(0, "[WARNING] Sent push notification to user regarding increased consumption.")
        state["ai_insight"] = "Warning: Carbon consumption is accelerating. Your Air Conditioner accounts for a significant portion of today's usage."
    
    elif 85 <= pct_used < 95:
        if state["stage"] != "Smart Optimization":
            state["stage"] = "Smart Optimization"
            # Agent Action: Optimize 'Important'
            for app in state["appliances"]:
                if app["name"] == "Air Conditioner":
                    app["power_w"] = 1000 # Simulating temp increase
                    state["agent_actions"].insert(0, "[ACTION] Adjusted Air Conditioner temp by +1°C (Eco-Mode).")
        state["ai_insight"] = "Smart Optimization active. I have adjusted your high-drain appliances to prevent a budget breach."
    
    elif pct_used >= 95:
        if state["stage"] != "Critical":
            state["stage"] = "Critical"
            # Agent Action: Turn off 'Non-Essential'
            for app in state["appliances"]:
                if app["priority"] == "Non-Essential" and app["status"] == "ON":
                    app["status"] = "OFF"
                    app["power_w"] = 0
                    state["agent_actions"].insert(0, f"[CRITICAL ACTION] Auto-suspended {app['name']} to protect carbon budget.")
        state["ai_insight"] = "CRITICAL: Approaching budget limit! All non-essential appliances have been temporarily suspended based on your preferences."

    # Keep the actions list small
    state["agent_actions"] = state["agent_actions"][:5]

    # Reset loop for demo purposes if it goes too high
    if state["current_usage"] >= 310:
        print("Resetting simulation loop for demo...")
        state["current_usage"] = 180.0
        state["stage"] = "Normal"
        state["agent_actions"] = []
        for app in state["appliances"]:
            if app["name"] == "Air Conditioner":
                app["power_w"] = 1500
            if app["priority"] == "Non-Essential":
                app["status"] = "ON"

print("Starting Home Carbon Bank Agent Simulator...")
try:
    while True:
        simulate_tick()
        write_state()
        print(f"Current Usage: {state['current_usage']:.1f} kg | Stage: {state['stage']}")
        time.sleep(3) # Tick every 3 seconds for fast demo
except KeyboardInterrupt:
    print("Simulator stopped.")
