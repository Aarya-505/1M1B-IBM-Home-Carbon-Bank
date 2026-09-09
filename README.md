# 1M1B IBM Home Carbon Bank 🌍🔋
**AI-Powered Smart Carbon Management System**

This repository contains the concept, architectural design, and fully functional agentic AI prototype for the **Home Carbon Bank**, developed as part of the **1M1B - IBM SkillsBuild AI for Sustainability Virtual Internship**.

## Overview
The Home Carbon Bank is an AI-driven, IoT-enabled ecosystem that treats household carbon emissions like a digital bank account. It calculates real-time CO₂-equivalent (CO₂e) footprints and uses Agentic AI to help households stay within a sustainable "Carbon Budget" without sacrificing comfort.

## Key Features
* **Carbon Budgeting:** Gamifies energy management by tracking CO₂e limits.
* **Agentic AI Logic:** Autonomous prediction and control using a 4-stage optimization state machine (Normal, Warning, Smart Optimization, Critical).
* **IBM BOB Integration:** Leverages IBM BOB for ideation, agent logic prototyping, and providing conversational AI insights on the user dashboard.
* **Hardware IoT Support:** Designed to ingest telemetry from ESP32/Smart Plugs.

## Contents
* `1M1B_Project_Deliverable.md`: The complete final project submission document, containing the problem statement, SDG alignment, system architecture (Mermaid flowchart), and impact statement.
* `prototype/`: A fully functional local software prototype containing the Python Agentic backend and the Glassmorphism Web UI.

## 🚀 How to Run the Prototype
To see the Agentic AI in action and view the interactive dashboard:

1. **Start the AI Backend:**
   Open a terminal, navigate to the `prototype` folder, and run the Python simulator:
   ```bash
   cd prototype
   python carbon_agent.py
   ```
   *(This script will begin simulating IoT data and generating real-time `state.json` updates).*

2. **Open the Dashboard:**
   While the Python script is running, open the `prototype/index.html` file in any modern web browser (e.g., Chrome, Edge). You can also run it via VS Code's "Live Server".
   
3. **Watch the AI:**
   As the simulated carbon usage increases, the dashboard will dynamically update. You will see the AI autonomously shift from **Normal** to **Smart Optimization** to **Critical**, generating IBM BOB insights and automatically disabling non-essential appliances to protect the carbon budget!

---
*Designed for SDG 12 (Responsible Consumption and Production) & SDG 13 (Climate Action).*
