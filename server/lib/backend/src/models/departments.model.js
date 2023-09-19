"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Departments = void 0;
const sequelize_1 = require("sequelize");
const dbConnect_1 = require("./dbConnect");
exports.Departments = dbConnect_1.sequelize.define('Department', {
    department_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    department_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    manager_id: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    budget: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    establishment_year: {
        type: sequelize_1.DataTypes.INTEGER,
    },
}, {
    tableName: 'departments',
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
});
//# sourceMappingURL=departments.model.js.map