"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
const api_1 = require("../constants/api");
const dialectOptions = api_1.isDevelopment
    ? undefined
    : {
        ssl: 'require',
        sslmode: 'require',
    };
exports.dbConfig = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
    dialect: 'postgres',
    dialectOptions,
};
//# sourceMappingURL=db.config.js.map