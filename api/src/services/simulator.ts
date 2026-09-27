import { query } from '../db/postgres';
import driver from '../db/neo4j';
import { io } from '../index';

let simulationInterval: NodeJS.Timeout | null = null;

const MOCK_ACCOUNTS = [
  'acc_user123', 'acc_user456', 'mule_account_01', 'mule_account_02', 'merchant_88', 'acc_user999', 'suspect_acc_03'
];

const generateRandomTransaction = async () => {
  const sender_id = MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)];
  let receiver_id = MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)];
  while (sender_id === receiver_id) {
    receiver_id = MOCK_ACCOUNTS[Math.floor(Math.random() * MOCK_ACCOUNTS.length)];
  }
  
  const amount = (Math.random() * 100000).toFixed(2);
  const upi_id = `${receiver_id}@ybl`;
  const timestamp = new Date();
  const transaction_id = `TXN-SIM-${Date.now()}`;

  try {
    // 1. PostgreSQL Insert
    const pgResult = await query(
      `INSERT INTO transactions (transaction_id, sender_id, receiver_id, amount, timestamp, upi_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [transaction_id, sender_id, receiver_id, amount, timestamp, upi_id]
    );

    const transaction = pgResult.rows[0];

    // 2. Neo4j Insert
    const session = driver.session();
    try {
      await session.run(
        `MERGE (s:Account {id: $sender_id})
         MERGE (r:Account {id: $receiver_id})
         CREATE (s)-[:SENT {amount: $amount, timestamp: $timestamp, transaction_id: $transaction_id}]->(r)`,
        { sender_id, receiver_id, amount: parseFloat(amount), timestamp: timestamp.toISOString(), transaction_id }
      );
    } finally {
      await session.close();
    }

    // 3. Evaluate Risk via ML Pipeline
    let risk_level = 'Low';
    try {
      const mlResponse = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_id,
          sender_id,
          receiver_id,
          amount: parseFloat(amount),
          upi_id
        })
      });
      const mlResult = await mlResponse.json();
      risk_level = mlResult.risk_level;
      
      // We could store anomalies or risk score in postgres/neo4j here if we wanted
    } catch (err) {
      console.warn('[Simulator] ML Pipeline unreachable. Falling back to rules.');
      risk_level = parseFloat(amount) > 80000 ? 'High' : parseFloat(amount) > 40000 ? 'Medium' : 'Low';
    }
    
    // 4. Emit via WebSockets
    io.emit('new_transaction', {
      ...transaction,
      risk_level
    });

    console.log(`[Simulator] Generated TXN: ${transaction_id} | ${amount} INR`);

  } catch (err) {
    console.error('[Simulator] Error generating transaction:', err);
  }
};

export const startSimulation = () => {
  if (simulationInterval) return;
  console.log('[Simulator] Starting live simulation...');
  simulationInterval = setInterval(generateRandomTransaction, 3000); // every 3 seconds
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('[Simulator] Stopped live simulation.');
  }
};
