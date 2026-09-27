const neo4j = require('neo4j-driver');
const d = neo4j.driver('neo4j://127.0.0.1:7687', neo4j.auth.basic('neo4j', 'mulegraph@1056'));
const s = d.session();
s.run("MATCH (a:Account)-[r]->(b:Account) RETURN a.id LIMIT 1")
 .then(r => { console.log(r.records[0].get('a.id')); process.exit(0); })
 .catch(e => { console.error(e); process.exit(1); });
