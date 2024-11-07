# Game Performance Evaluator 🚀

This project predicts whether a specific game can achieve good FPS (frames per second) on a given system, based on its hardware and network resources. Developed during our first hackathon at **R.R. Institute of Technology**, this tool is designed to help gamers assess their system's capabilities in real time.

## Features 🌟
- **System Resource Analysis:** Real-time scanning of CPU, GPU, memory, and network specifications.
- **FPS Prediction:** Provides insights into whether a game can deliver smooth performance on the system.
- **Interactive UI:** User-friendly React interface for game-specific predictions.
- **Tech Stack:** Built using Node.js, Express, React, and REST APIs.

---

## How It Works 🔍

1. **Backend:**
   - Gathers system specs using the `systeminformation` library.
   - Processes CPU, GPU, RAM, and network data.
   - REST API to serve data and FPS predictions.

2. **Frontend:**
   - Accepts game name and resolution as inputs.
   - Displays system specs and predicted FPS quality.

3. **Data Flow:**
   - Backend collects real-time system information.
   - Predicts FPS based on input parameters and system specs.
   - Frontend renders results for an intuitive user experience.

---

## Tech Stack 💻
- **Backend:** Node.js, Express, Systeminformation library.
- **Frontend:** React, CSS.
- **APIs:** RESTful API for data communication.
- **Other Tools:** Environment management with `dotenv`, `cors` for cross-origin requests, and `compression` for optimized performance.

---

## Installation ⚙️

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/game-performance-evaluator.git
   cd game-performance-evaluator

# For Backend
npm install

# For Frontend
cd frontend
npm install

# Backend
node index.js

# Frontend
cd frontend
npm start
