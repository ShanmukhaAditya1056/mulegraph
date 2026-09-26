# MuleGraph AI — Gemini Build Specification

## 1. Project Identity

**Project name:** MuleGraph AI  
**Final title:** Explainable Temporal Graph Learning for Detecting Potential UPI Mule-Account Networks

MuleGraph AI is a final-year cybersecurity project combining transaction-level machine learning, temporal graph learning, anomaly detection, explainable AI, and investigator workflows to identify **potential suspicious UPI money-mule networks**.

The system must present results as **potential risk indicators requiring human review**. It must never automatically accuse, blacklist, freeze, or report a person/account.

---

## 2. Reference Documents

This specification combines the two supplied reference PDFs:

- **PDF 1:** research foundation — temporal graph learning, explainability, evidence integrity, synthetic/authorized data, evaluation, privacy, and human review.
- **PDF 2:** real-time architecture reference — transaction streaming, fast tabular screening, GNN neighborhood analysis, hybrid risk fusion, and analyst dashboard concepts.

Do not copy reported metrics from either PDF as project results. All final metrics must come from our own experiments.

---

## 3. Core Research Question

> Can transaction-level machine learning combined with temporal graph learning improve the detection and explainability of potential UPI mule-account networks compared with transaction-level models alone?

---

## 4. Primary Scenarios

### Scenario 1 — Task / earning scam

```text
Multiple users/victims
        ↓
Collection / mule account
        ↓
Layering account(s)
        ↓
Onward transfer / cash-out node
```

### Scenario 2 — Investment scam

Use a synthetic investment-scam flow with collection and multi-hop/layering behavior.

Keep the project limited to these two scenarios for the MVP.

---

## 5. Final Architecture

```text
Flutter Android
      ↓
Firebase Authentication
      ↓
Node.js + Express API
      ├── PostgreSQL
      └── Neo4j
              ↓
      Feature Engineering
              ↓
      ┌───────┼────────┐
      ↓       ↓        ↓
   XGBoost  GraphSAGE  Isolation Forest
   LightGBM Temporal    Anomaly
      ↓       GNN       Detection
      └───────┼────────┘
              ↓
          Risk Fusion
              ↓
        Explainable AI
              ↓
      ┌───────┴────────┐
      ↓                ↓
Flutter App       React Web Dashboard
                       ↓
          Graph / Timeline / Evidence
                       ↓
               Investigation Report
```

### Optional real-time layer

Kafka/Redis may be added only after the core MVP works. Do not make production-scale streaming infrastructure a blocker.

---

## 6. Final Technology Stack

| Layer | Technology |
|---|---|
| Android | Flutter |
| Web | React + Material UI |
| Authentication | Firebase Authentication |
| Backend | Node.js + Express |
| Main DB | PostgreSQL |
| Graph DB | Neo4j |
| ML API | Python + FastAPI |
| Baseline | Logistic Regression |
| Tabular ML | XGBoost + LightGBM |
| Primary GNN | GraphSAGE |
| Anomaly detector | Isolation Forest |
| Explainability | SHAP + graph/subgraph explanation |
| Graph visualization | Cytoscape.js |
| Evidence integrity | SHA-256 |
| Data | Synthetic UPI-like + suitable public supplementary data |
| Live demo | Synthetic transaction stream |

---

# 7. FINAL UI REFERENCE

The finalized UI image is included beside this file:

**`./finalized_ui_reference.png`**

![MuleGraph AI Finalized UI](./finalized_ui_reference.png)

### Global visual direction

- Light / white interface
- White cards and surfaces
- Teal/cyan primary brand color
- Navy text
- Blue secondary accents
- Red only for high-risk/potential-risk indicators
- Green for safe/low-risk states
- Amber for medium-risk states
- Clean enterprise cybersecurity aesthetic
- Rounded cards
- Subtle borders and shadows
- Responsive design
- **Do not revert to the previous dark cyber UI**

### Suggested design tokens

```text
Background: #EEF7F7
Surface:    #FFFFFF
Primary:    #079A9A
Primary 2:  #0FA7A7
Navy:       #0B1726
Text:       #172033
Muted:      #718096
Border:     #DDE6EA
Blue:       #3B82F6
Green:      #2E9B62
Amber:      #D99621
Risk Red:   #E05252
```

Use Inter, Manrope, or another clean modern sans-serif.

---

# 8. ANDROID UI

## Required screens

1. Splash
2. Login
3. Register
4. Home Dashboard
5. Check Payment
6. Analysis Result
7. Network View
8. Report Scam / Incident
9. My Reports
10. Profile / Settings

### Android Login

Use the same visual language as the reference image:

- MuleGraph AI branding
- Welcome Back
- Email field
- Password field
- Forgot Password
- Keep me signed in
- Sign In
- Optional Google/Microsoft SSO only if actually implemented
- Request Account / Register
- White form area
- Teal primary action

### Home

Show:

- Check Payment
- Report Incident
- My Reports
- Network View
- Recent risk results
- Clear safety messaging

### Check Payment

Inputs:

- UPI ID
- Amount
- Transaction ID/reference
- Date/time when available

Do not request:

- UPI PIN
- OTP
- bank password
- Aadhaar
- unnecessary financial credentials

### Analysis Result

Show:

- Potential Risk Indicator
- Behavior Risk
- Network Risk
- Temporal Anomaly
- Connected account count
- Key indicators
- View Network button

Use wording such as:

> Potential network risk detected

Never:

> This person is a criminal.

### Report Incident

Fields:

- Scam type
- UPI ID
- Transaction reference
- Amount
- Description
- Evidence screenshot

Evidence flow:

```text
Upload
  ↓
PII redaction
  ↓
SHA-256 hash
  ↓
Secure storage
  ↓
Incident record
```

### Network View

Provide a simplified mobile graph with:

- connected accounts
- suspicious/potential-risk nodes
- transaction direction
- hop count
- timestamps when useful

---

# 9. WEB UI

## Required screens

1. **Web Login**
2. Dashboard
3. Cases / Incidents
4. Account Investigation
5. Transaction Explorer
6. Network Graph Explorer
7. Temporal Timeline
8. AI Explanation
9. Evidence Verification
10. Investigation Report
11. Analytics
12. Dataset Management
13. Settings

## Web Login

The Web Login is mandatory and must use the split layout shown in the finalized reference:

### Left panel

- MuleGraph AI branding
- Explainable Financial Risk Intelligence
- Temporal graph analysis
- AI risk intelligence
- Human review
- Dark navy brand panel

### Right panel

- Welcome Back
- Email Address
- Password
- Forgot Password
- Keep me signed in
- Sign In
- Optional SSO buttons only if implemented
- Request an Account

Keep the overall page white and spacious.

---

# 10. Web Dashboard

The dashboard is the main analyst command center.

Show:

### KPI cards

- Accounts analyzed
- Potential-risk accounts
- Suspicious/potential-risk networks
- Transactions analyzed
- Open investigations

### Main panels

- Suspicious network graph
- Recent incidents
- Risk distribution
- Top potential-risk accounts
- Recent transaction activity
- Model status / inference latency

Do not label accounts as definitively fraudulent.

---

# 11. Account Investigation

Example layout:

```text
Account: ACC_10482

Behavior Risk:     calculated
Network Risk:      calculated
Temporal Anomaly:  calculated
Overall Risk:      calculated

Transactions:      calculated
Unique Senders:    calculated
Unique Receivers:  calculated

Potential indicators:
- rapid fan-in
- rapid transaction burst
- rapid onward transfers
- multi-hop movement
- unusual timing
```

All values must be calculated from actual data. Never hardcode example metrics in production UI.

---

# 12. Network Graph Explorer

Graph entities:

- Account
- UPI ID
- Phone token
- Device token
- Merchant
- Transaction

Relationships:

```text
Account ──SENT──→ Account
Account ──RECEIVED──→ Account
Account ──USES_UPI──→ UPI
Account ──USES_PHONE──→ Phone
Account ──USES_DEVICE──→ Device
Account ──MADE──→ Transaction
```

Use Cytoscape.js for interactive graph visualization.

Features:

- zoom
- pan
- node selection
- relationship inspection
- hop filtering
- time filtering
- suspicious/potential-risk highlighting
- transaction details

---

# 13. Temporal Timeline

This is required.

Show events chronologically:

```text
09:01  USER_102 → MULE_04   ₹2,500
09:03  USER_381 → MULE_04   ₹1,800
09:05  USER_442 → MULE_04   ₹3,200
09:07  MULE_04  → MULE_17   ₹7,500
09:09  MULE_17  → MULE_28   ₹6,900
```

Temporal features include:

- transaction velocity
- burst activity
- time since previous transaction
- account age
- fan-in
- fan-out
- holding time
- multi-hop movement

---

# 14. AI Explanation

### XGBoost / LightGBM

Use SHAP for feature-level explanations.

Example:

```text
Top contributing indicators

+ High fan-in
+ Rapid transaction burst
+ High fan-out
+ Short holding time
+ Multi-hop movement
```

### GraphSAGE

Show the relevant connected subgraph or neighborhood supporting the model result.

Explanations must be understandable to an analyst.

---

# 15. Live Simulation Mode

Add a demo control:

> Start Fraud Network Simulation

Generate synthetic transactions such as:

```text
09:01:02 USER_102 → MULE_04 ₹2,500
09:01:05 USER_381 → MULE_04 ₹1,800
09:01:07 USER_442 → MULE_04 ₹3,200
09:01:09 MULE_04 → MULE_17 ₹7,500
09:01:12 MULE_17 → MULE_28 ₹6,900
```

The system should:

1. ingest the event
2. update PostgreSQL
3. update Neo4j
4. generate/update features
5. run model inference
6. update risk
7. update graph
8. show explanation

This is a synthetic demonstration. Do not connect to live UPI/NPCI infrastructure.

---

# 16. Machine Learning

## Models

### Baseline
Logistic Regression

### Tabular
XGBoost  
LightGBM

### Primary GNN
GraphSAGE

### Unsupervised anomaly
Isolation Forest

### Fusion

```text
Behavior Score
       +
Network Score
       +
Anomaly Score
       ↓
Risk Fusion
       ↓
Overall Potential Risk
```

The fusion formula must be documented and experimentally justified.

Do not pre-decide which model is best.

---

# 17. Evaluation

Measure:

- Precision
- Recall
- F1
- ROC-AUC
- PR-AUC
- False-positive rate
- False-negative rate
- Inference latency
- Graph query time
- API response time
- Explanation quality

Evaluate temporal generalization where practical.

Example comparison:

| Model | Precision | Recall | F1 | PR-AUC | Latency |
|---|---:|---:|---:|---:|---:|
| Logistic Regression | actual | actual | actual | actual | actual |
| XGBoost | actual | actual | actual | actual | actual |
| LightGBM | actual | actual | actual | actual | actual |
| GraphSAGE | actual | actual | actual | actual | actual |
| Hybrid | actual | actual | actual | actual | actual |

Never copy reported results from the reference PDFs into this table.

---

# 18. Data

Primary data should be synthetic UPI-like transaction data.

Include:

### Legitimate patterns

- normal peer-to-peer transfers
- family transfers
- salary
- bills
- merchant payments
- legitimate businesses

### Potential suspicious patterns

- rapid fan-in
- rapid fan-out
- burst activity
- multi-hop movement
- short holding times
- dormant-to-active behavior
- task scam collection
- investment scam collection

Use public datasets only as supplementary/reference data where their schema and license support the use.

---

# 19. Security and Privacy

Mandatory:

- Firebase token verification
- role-based access control
- input validation
- rate limiting
- secure file upload
- audit logs
- evidence hashing
- PII redaction where applicable
- HTTPS in deployment
- no sensitive payment credentials

Never collect:

- UPI PIN
- OTP
- bank passwords
- Aadhaar
- unnecessary financial credentials

Never build:

- automatic bank freezing
- automatic blacklisting
- automatic criminal accusation
- unauthorized bank access
- SMS surveillance

---

# 20. Roles

### User

- login
- check payment information
- report incidents
- upload evidence
- view own reports

### Analyst

- search accounts
- investigate networks
- inspect transactions
- view model explanations
- investigate timelines
- verify evidence
- create reports

### Admin

- manage users
- manage datasets
- manage models
- review audit logs
- system settings

---

# 21. PostgreSQL

Suggested entities:

```text
users
incidents
transactions
reports
evidence
audit_logs
model_results
```

Example fields:

```text
users
- id
- firebase_uid
- name
- email
- role
- created_at

transactions
- id
- transaction_id
- sender_id
- receiver_id
- amount
- timestamp
- upi_id

incidents
- id
- user_id
- incident_type
- description
- status
- created_at

evidence
- id
- incident_id
- file_url
- file_type
- sha256_hash
- uploaded_at
```

---

# 22. Neo4j

Store transaction intelligence in the graph.

Example Cypher:

```cypher
(:Account)-[:SENT {amount: $amount, timestamp: $timestamp}]->(:Account)
(:Account)-[:USES_UPI]->(:UPI)
(:Account)-[:USES_PHONE]->(:Phone)
(:Account)-[:USES_DEVICE]->(:Device)
```

Graph construction must preserve transaction timestamps.

---

# 23. API Structure

Suggested endpoints:

```text
POST   /api/auth/verify
POST   /api/transactions/analyze
GET    /api/accounts/:id
GET    /api/accounts/:id/network
GET    /api/accounts/:id/timeline
POST   /api/incidents
GET    /api/incidents
GET    /api/incidents/:id
POST   /api/incidents/:id/evidence
GET    /api/reports/:id
POST   /api/simulation/start
POST   /api/simulation/stop
GET    /api/dashboard/metrics
```

ML service:

```text
POST /ml/predict
POST /ml/explain
POST /ml/graph
```

---

# 24. Development Priority

### Phase 1 — Foundation
- repository structure
- Firebase authentication
- PostgreSQL
- Neo4j
- Node API

### Phase 2 — Android
- login
- home
- check payment
- report incident
- my reports

### Phase 3 — Data
- synthetic transaction generator
- legitimate scenarios
- task scam scenario
- investment scam scenario

### Phase 4 — ML
- feature engineering
- Logistic Regression
- XGBoost
- LightGBM
- Isolation Forest
- GraphSAGE

### Phase 5 — Risk engine
- fusion
- SHAP
- graph explanation

### Phase 6 — Web
- login
- dashboard
- account investigation
- graph explorer
- transaction explorer
- timeline
- evidence
- reports

### Phase 7 — Live simulation
- synthetic stream
- graph updates
- model updates
- dashboard updates

### Phase 8 — Evaluation
- metrics
- latency
- comparison
- screenshots
- final report

---

# 25. Coding Rules for Gemini

1. Do not redesign the project architecture without explicit approval.
2. Do not replace GraphSAGE with another primary GNN unless requested.
3. Do not remove Neo4j.
4. Do not remove PostgreSQL.
5. Do not replace Firebase Authentication.
6. Keep Android in Flutter.
7. Keep Web in React + MUI.
8. Keep the UI light/white/teal.
9. Do not return to the old dark cyber UI.
10. Never hardcode ML results.
11. Clearly distinguish synthetic/demo data from real-world data.
12. Never expose secrets or credentials in source code.
13. Use `.env` for secrets.
14. Validate all API input.
15. Use Firebase token verification on protected APIs.
16. Use RBAC for User/Analyst/Admin.
17. Use safe file upload validation.
18. Never collect UPI PIN, OTP, bank password or Aadhaar.
19. Never claim that a model has proven criminal activity.
20. Use phrases such as `potential risk`, `potentially suspicious network`, and `requires human review`.
21. Write modular, maintainable code.
22. Add error handling and loading states.
23. Add responsive layouts.
24. Preserve accessibility and readable contrast.
25. Document important ML and API decisions.

---

# 26. Definition of Done

- [ ] Android login works
- [ ] Web login works
- [ ] Firebase authentication works
- [ ] User/Analyst/Admin roles work
- [ ] User can submit an incident
- [ ] Evidence can be uploaded safely
- [ ] Evidence gets SHA-256 hash
- [ ] Transactions are stored in PostgreSQL
- [ ] Transaction graph is stored in Neo4j
- [ ] Synthetic data generator works
- [ ] Task-scam network can be generated
- [ ] Investment-scam network can be generated
- [ ] XGBoost works
- [ ] LightGBM works
- [ ] Isolation Forest works
- [ ] GraphSAGE works
- [ ] Risk fusion works
- [ ] SHAP explanation works
- [ ] Graph/subgraph explanation works
- [ ] Android can show analysis
- [ ] Web dashboard works
- [ ] Network graph works
- [ ] Timeline works
- [ ] Live synthetic simulation works
- [ ] Investigation report works
- [ ] Evaluation metrics are recorded
- [ ] No real payment credentials are collected
- [ ] No unauthorized bank/UPI integration exists

---

## Final Principle

Build **one coherent cybersecurity intelligence platform**, not a collection of disconnected features.

The strongest demonstration is:

```text
Synthetic transaction arrives
        ↓
Graph changes
        ↓
Temporal features change
        ↓
ML models score the behavior
        ↓
Risk fusion produces a potential-risk indicator
        ↓
Graph highlights the relevant network
        ↓
AI explains the contributing factors
        ↓
Analyst investigates
        ↓
Evidence is verified
        ↓
Investigation report is generated
```

The UI must remain consistent with `finalized_ui_reference.png`.
