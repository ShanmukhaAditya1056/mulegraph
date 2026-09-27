# MuleGraph AI

![MuleGraph Header](https://via.placeholder.com/1000x300.png?text=MuleGraph+AI+-+Intelligent+Money+Mule+Detection)

MuleGraph AI is a comprehensive, real-time investigation platform designed to detect, visualize, and analyze money mule networks and suspicious financial layering activities. Built on a powerful microservices architecture, it seamlessly blends traditional tabular machine learning with advanced Graph Neural Networks (GraphSAGE) to uncover hidden transaction clusters that traditional rule-based systems miss.

## 🚀 Features

- **Real-Time Detection Dashboard:** Live monitoring of transactions and risk scores powered by WebSockets.
- **Interactive Network Visualization:** Deep-dive into transactional relationships using Cytoscape.js. Visually identify cash-out bottlenecks and layering rings.
- **Advanced ML Pipeline:** 
  - *GraphSAGE* for structural network analysis.
  - *Hybrid Fusion* models combining tabular and graph embeddings for 95%+ precision.
- **Explainable AI (XAI):** SHAP-based feature importance integrated directly into the UI to explain *why* an account was flagged (e.g., Fan-in/out ratios, velocity bursts).
- **Temporal Timeline:** Heuristic-based temporal analysis identifying rapid transaction bursts and unusual holding times.
- **Case Management & Evidence Verification:** Robust case building with client-side SHA-256 cryptographic hashing for untampered evidence uploading.
- **Automated Reporting:** Generate, preview, and download clean, print-ready PDF investigation reports.

## 🏗️ Architecture

The project is structured as a robust monorepo with the following microservices:

- **`/web` (Frontend):** React 18, Vite, TypeScript, Material-UI (MUI), Recharts, Cytoscape.js.
- **`/api` (Backend Core):** Node.js, Express, TypeScript, Socket.io.
  - *Databases:* PostgreSQL (relational/incidents) & Neo4j (graph relations).
  - *Auth:* Firebase Authentication.
- **`/ml` (AI Engine):** Python, FastAPI, PyTorch, PyTorch Geometric (PyG).
- **`/data_generator` (Simulator):** Python scripts to inject synthetic financial data and mule patterns for testing.

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL
- Neo4j Desktop or Server
- A Firebase Project (for Authentication)

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ShanmukhaAditya1056/mulegraph.git
cd mulegraph
```

### 2. Setup PostgreSQL & Neo4j
- Ensure your local instances of Postgres (default port `5432`) and Neo4j (default port `7687`) are running.
- Create a Postgres database named `muleai`.

### 3. Backend (API) Setup
```bash
cd api
npm install
```
- Create an `.env` file in the `api` directory:
  ```env
  PORT=5000
  PG_USER=postgres
  PG_HOST=localhost
  PG_DATABASE=muleai
  PG_PASSWORD=your_password
  PG_PORT=5432
  NEO4J_URI=bolt://localhost:7687
  NEO4J_USER=neo4j
  NEO4J_PASSWORD=your_password
  FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_firebase_json
  ```
- Initialize the databases and start the server:
  ```bash
  npx ts-node scripts/initDB.ts
  npm run dev
  ```

### 4. Machine Learning (ML) Setup
```bash
cd ml
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 5. Frontend (Web) Setup
```bash
cd web
npm install
```
- Create an `.env` file in the `web` directory containing your Firebase config keys.
- Start the Vite development server:
  ```bash
  npm run dev
  ```

### 6. Run the Data Simulator
To populate the dashboard with real-time flowing data:
```bash
cd data_generator
python generate_data.py
```

## 🔒 Security Notes
This project utilizes Firebase Admin SDK for backend verification. Make sure your `serviceAccountKey.json` is Base64 encoded and strictly stored in your local `.env` variables to prevent accidental exposure to version control.

## 📜 License
This project is licensed under the MIT License.
