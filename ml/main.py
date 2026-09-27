from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI(title="MuleGraph AI - Risk Evaluation API")

class TransactionInput(BaseModel):
    transaction_id: str
    sender_id: str
    receiver_id: str
    amount: float
    upi_id: str

class RiskEvaluation(BaseModel):
    transaction_id: str
    risk_score: float
    risk_level: str
    anomalies_detected: list[str]

# For MVP, we simulate a model's prediction logic using heuristic rules and randomization.
# In production, this would load a pre-trained scikit-learn or XGBoost model.
@app.post("/api/analyze", response_model=RiskEvaluation)
async def analyze_transaction(txn: TransactionInput):
    score = 0.0
    anomalies = []

    # Basic Heuristics
    if txn.amount > 80000:
        score += 0.5
        anomalies.append("Unusually high transaction amount.")
    elif txn.amount > 40000:
        score += 0.2
        anomalies.append("Elevated transaction amount.")

    if "@ybl" in txn.upi_id:
        score += 0.1
        
    # Simulated Network-based features (Mocking graph centrality/clustering)
    network_risk = random.uniform(0, 0.4)
    if network_risk > 0.3:
        anomalies.append("Account part of a suspected mule cluster.")
    score += network_risk

    # Cap score at 1.0
    final_score = min(score, 1.0)
    
    if final_score > 0.7:
        risk_level = "Critical"
    elif final_score > 0.5:
        risk_level = "High"
    elif final_score > 0.3:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return RiskEvaluation(
        transaction_id=txn.transaction_id,
        risk_score=round(final_score, 2),
        risk_level=risk_level,
        anomalies_detected=anomalies
    )

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ML Risk Engine"}
