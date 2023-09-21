"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Departments = void 0;
const sequelize_1 = require("sequelize");
const dbConnect_1 = require("./dbConnect");
exports.Departments = dbConnect_1.sequelize.define('Department', {
    departmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'department_id',
    },
    departmentName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'department_name',
    },
    managerId: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'manager_id',
    },
    budget: {
        type: sequelize_1.DataTypes.NUMBER,
        field: 'budget',
    },
    establishmentYear: {
        type: sequelize_1.DataTypes.INTEGER,
        field: 'establishment_year',
    },
}, {
    tableName: 'departments',
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
});
//# sourceMappingURL=departments.model.js.map