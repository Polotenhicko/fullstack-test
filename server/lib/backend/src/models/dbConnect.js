"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = require("../config/db.config");
exports.sequelize = new sequelize_1.Sequelize(db_config_1.dbConfig);
//# sourceMappingURL=dbConnect.js.map