import { getClient } from './src/db.js';

async function checkDb() {
    const client = getClient();
    try {
        await client.connect();
        console.log('Database connection successful.');
        process.exit(0);
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

checkDb();