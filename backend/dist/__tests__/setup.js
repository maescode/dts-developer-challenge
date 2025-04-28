"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../db/database"));
beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    return new Promise((resolve) => {
        database_1.default.serialize(() => {
            database_1.default.run('DROP TABLE IF EXISTS tasks', () => {
                database_1.default.run(`
          CREATE TABLE tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            due_date DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, () => resolve());
            });
        });
    });
});
afterAll((done) => {
    database_1.default.close(done);
});
