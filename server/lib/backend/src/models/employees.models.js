"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employees = void 0;
const sequelize_1 = require("sequelize");
const dbConnect_1 = require("./dbConnect");
const departments_model_1 = require("./departments.model");
exports.Employees = dbConnect_1.sequelize.define('Employees', {
    employeeId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'employee_id',
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(255),
        field: 'first_name',
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(255),
        field: 'last_name',
    },
    position: {
        type: sequelize_1.DataTypes.STRING(255),
        field: 'position',
    },
    salary: {
        type: sequelize_1.DataTypes.NUMBER,
        field: 'salary',
    },
    hireDate: {
        type: sequelize_1.DataTypes.DATE,
        field: 'hire_date',
    },
    departmentId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: departments_model_1.Departments,
            key: 'department_id',
        },
        field: 'department_id',
    },
}, {
    tableName: 'employees',
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
});
exports.Employees.hasOne(departments_model_1.Departments, { foreignKey: 'department_id' });
//# sourceMappingURL=employees.models.js.map