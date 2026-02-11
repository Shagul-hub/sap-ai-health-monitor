from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# This describes the data we expect from SAP
class LogData(BaseModel):
    cpu: float
    memory: float
    disk: float

@app.post("/predict")
def predict_risk(data: LogData):
    # 1. DEBUG: Print exactly what SAP sent us
    print(f"\n👀 AI RECEIVED DATA -> CPU: {data.cpu}%, RAM: {data.memory}%")

    # 2. CALCULATE: A simple risk formula
    # We add CPU and Memory together. Max possible is 200.
    total_load = data.cpu + data.memory
    
    # Calculate a score between 0.0 and 1.0
    risk_score = total_load / 200.0

    # 3. DECIDE: Set the Risk Level based on the score
    if total_load > 160:
        status = "High"   # Critical!
    elif total_load > 100:
        status = "Medium" # Warning
    else:
        status = "Low"    # Safe ✅

    print(f"🧠 AI DECISION -> Score: {risk_score:.2f} | Level: {status}")

    # 4. RETURN: Send the answer back to SAP
    return {
        "risk_score": risk_score, 
        "risk_level": status
    }