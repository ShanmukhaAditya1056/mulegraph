import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export const testNeo4jConnection = async () => {
  try {
    const serverInfo = await driver.getServerInfo();
    console.log('Neo4j Connected:', serverInfo.address);
    return true;
  } catch (err) {
    console.error('Neo4j Connection Error:', err);
    return false;
  }
};

export const getSession = () => {
  return driver.session();
};

export default driver;
