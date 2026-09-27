import os
import random
import uuid
from datetime import datetime, timedelta
from faker import Faker
import pg8000.native
from neo4j import GraphDatabase
from dotenv import load_dotenv

import sys

# Load environment variables
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../api/.env'))
load_dotenv(dotenv_path=env_path)

# Database Credentials
PG_HOST = os.getenv('DB_HOST', 'localhost')
PG_PORT = os.getenv('DB_PORT', '5432')
PG_USER = os.getenv('DB_USER', 'postgres')
PG_PASS = os.getenv('DB_PASS', 'shanuadi@1056')
PG_NAME = os.getenv('DB_NAME', 'mulegraph')

NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASS = os.getenv('NEO4J_PASSWORD', 'password')

fake = Faker('en_IN') # Using Indian locale for realistic UPI and names

def generate_accounts(num_accounts):
    accounts = []
    for _ in range(num_accounts):
        accounts.append({
            'account_id': str(uuid.uuid4())[:8],
            'name': fake.name(),
            'upi_id': f"{fake.user_name()}@{fake.random_element(['okicici', 'okaxis', 'okhdfcbank', 'oksbi', 'paytm'])}",
            'is_mule': random.random() < 0.05 # 5% chance to be a mule account
        })
    return accounts

def generate_transactions(accounts, num_transactions):
    transactions = []
    
    normal_accounts = [a for a in accounts if not a['is_mule']]
    mule_accounts = [a for a in accounts if a['is_mule']]
    
    for _ in range(num_transactions):
        # 90% normal transactions, 10% mule network activity
        if random.random() < 0.9 or not mule_accounts:
            sender = random.choice(accounts)
            receiver = random.choice([a for a in accounts if a['account_id'] != sender['account_id']])
            amount = round(random.uniform(100.0, 50000.0), 2)
        else:
            # Simulate mule scattering/gathering
            sender = random.choice(mule_accounts)
            receiver = random.choice([a for a in accounts if a['account_id'] != sender['account_id']])
            # Mule amounts might be suspiciously large or rapid small chunks
            amount = round(random.uniform(50000.0, 200000.0), 2)

        transactions.append({
            'transaction_id': f"TXN{fake.unique.random_number(digits=10)}",
            'sender_id': sender['account_id'],
            'receiver_id': receiver['account_id'],
            'amount': amount,
            'timestamp': fake.date_time_between(start_date='-30d', end_date='now'),
            'upi_id': sender['upi_id']
        })
    
    return transactions

def load_postgres(transactions):
    print("Connecting to PostgreSQL...")
    conn = pg8000.native.Connection(
        host=PG_HOST, port=int(PG_PORT), user=PG_USER, password=PG_PASS, database=PG_NAME
    )
    
    print(f"Inserting {len(transactions)} transactions into PostgreSQL...")
    insert_query = """
        INSERT INTO transactions (transaction_id, sender_id, receiver_id, amount, timestamp, upi_id)
        VALUES (:tx, :s, :r, :a, :t, :u)
        ON CONFLICT (transaction_id) DO NOTHING
    """
    for txn in transactions:
        conn.run(insert_query, 
            tx=txn['transaction_id'], s=txn['sender_id'], r=txn['receiver_id'], 
            a=txn['amount'], t=txn['timestamp'], u=txn['upi_id']
        )
    
    conn.close()
    print("PostgreSQL load complete.")

def load_neo4j(accounts, transactions):
    print("Connecting to Neo4j...")
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASS))
    
    with driver.session() as session:
        print(f"Inserting {len(accounts)} accounts into Neo4j...")
        # Create unique constraint on Account ID (Neo4j 5+ syntax)
        try:
            session.run("CREATE CONSTRAINT account_id IF NOT EXISTS FOR (a:Account) REQUIRE a.id IS UNIQUE")
        except Exception as e:
            print("Warning on constraint:", e)

        for acc in accounts:
            session.run(
                """
                MERGE (a:Account {id: $account_id})
                SET a.name = $name, a.upi_id = $upi_id, a.is_mule = $is_mule
                """,
                account_id=acc['account_id'], name=acc['name'], 
                upi_id=acc['upi_id'], is_mule=acc['is_mule']
            )
        
        print(f"Inserting {len(transactions)} relationships into Neo4j...")
        for txn in transactions:
            session.run(
                """
                MATCH (sender:Account {id: $sender_id})
                MATCH (receiver:Account {id: $receiver_id})
                MERGE (sender)-[r:TRANSFERRED_TO {tx_id: $tx_id}]->(receiver)
                SET r.amount = $amount, r.timestamp = $timestamp
                """,
                sender_id=txn['sender_id'], receiver_id=txn['receiver_id'],
                tx_id=txn['transaction_id'], amount=txn['amount'], 
                timestamp=txn['timestamp'].isoformat()
            )
            
    driver.close()
    print("Neo4j load complete.")

if __name__ == "__main__":
    NUM_ACCOUNTS = 50
    NUM_TXNS = 500
    
    print("Generating synthetic data...")
    accs = generate_accounts(NUM_ACCOUNTS)
    txns = generate_transactions(accs, NUM_TXNS)
    
    print("Loading databases...")
    load_postgres(txns)
    load_neo4j(accs, txns)
    print("Done! Data is ready for ML and Graph Analysis.")
