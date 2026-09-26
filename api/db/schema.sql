-- MuleGraph AI Initial PostgreSQL Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    receiver_id VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    upi_id VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    incident_type VARCHAR(100) NOT NULL,
    description TEXT,
    reported_amount DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Open',
    ai_risk_level VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id),
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    sha256_hash VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS model_results (
    id SERIAL PRIMARY KEY,
    account_id VARCHAR(100) NOT NULL,
    behavior_score DECIMAL(5, 4),
    network_score DECIMAL(5, 4),
    fusion_score DECIMAL(5, 4),
    is_anomaly BOOLEAN,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);
CREATE INDEX idx_incidents_user ON incidents(user_id);
CREATE INDEX idx_model_results_account ON model_results(account_id);
