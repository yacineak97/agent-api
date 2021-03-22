"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPool = void 0;
const pg_1 = require("pg");
exports.postgresPool = new pg_1.Pool({
    host: "localhost",
    port: 5432,
    min: 0,
    max: 0xffff,
    password: "yacine123",
    user: "postgres",
    database: "beacon",
});
