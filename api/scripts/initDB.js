"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const postgres_1 = __importDefault(require("../src/db/postgres"));
const initDB = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        const schemaPath = path_1.default.join(__dirname, '../db/schema.sql');
        const schemaSql = fs_1.default.readFileSync(schemaPath, 'utf8');
        console.log('Executing schema.sql...');
        await postgres_1.default.query(schemaSql);
        console.log('Successfully created all tables in the mulegraph database!');
    }
    catch (error) {
        console.error('Failed to initialize database:', error);
    }
    finally {
        await postgres_1.default.end();
    }
};
initDB();
