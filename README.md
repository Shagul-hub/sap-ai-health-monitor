# 🏥 SAP CAP AI Health Monitor (Self-Healing System)

## 🚀 Project Overview
This project is an **intelligent, self-healing SAP Cloud Application Programming (CAP)** system. It simulates a server health monitor that integrates with an external **Python AI Brain** to predict system failures and enables automated recovery via an SAP Fiori Dashboard.

**Key Features:**
* **📡 Real-time Ingestion:** Custom OData v4 endpoints for server log ingestion (CPU, Memory, Disk).
* **🧠 AI-Driven Insights:** Integration with a Python/Flask ML service for real-time risk prediction.
* **⚡ One-Click Remediation:** Custom CAP Actions ("Reboot System") to demonstrate self-healing capabilities.
* **📊 Professional UI:** Metadata-driven dashboard built 100% with SAP Fiori Elements and CDS Annotations.

## 🏗️ System Architecture


## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Backend** | Node.js, SAP CAP (@sap/cds) |
| **Database** | SQLite (Development) |
| **Frontend** | SAP Fiori Elements (OData v4) |
| **AI Brain** | Python, Flask, Scikit-Learn (Random Forest) |
| **Tools** | PowerShell, REST Client, Dotenv |

## ⚙️ Workflow
1. **Ingest:** System metrics are POSTed to the SAP CAP backend.
2. **Predict:** CAP triggers a side-effect call to the Python AI Brain (`/predict`).
3. **Analyze:** If the AI detects a risk > 80%, the record is flagged as **CRITICAL**.
4. **Visualize:** The critical status is reflected immediately on the Fiori List Report.
5. **Heal:** The Admin executes the **"Reboot"** action, resetting system state and clearing the alert.

## 🏁 Quick Start
1. **Clone the Repo:** `git clone <your-repo-link>`
2. **Install Dependencies:** `npm install`
3. **Start AI Brain:** `python ai_service.py` (Runs on port 8000)
4. **Launch SAP CAP:** `cds watch`
5. **Access UI:** Open `http://localhost:4004/webapp/index.html`

---
**Developed by:** Shagul A  
*Focusing on SAP BTP, AI Integration, and Full-Stack Development.*