"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesController = void 0;
const dbConnect_1 = require("../models/dbConnect");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class EmployeesController {
    constructor() {
        this.create = async (req, res) => {
            const { employeeId, firstName, lastName, position, salary, hireDate, departmentId } = req.body;
            try {
                const hasEmployeeByPK = await models_1.Employees.findByPk(employeeId);
                if (hasEmployeeByPK) {
                    throw new Error(`employee_id ${employeeId} has ready exist!`);
                }
                const maxEmployeeId = (await models_1.Employees.max('employeeId'));
                // Если есть записи в таблице Departments, увеличиваем максимальное значение на 1, иначе начинаем с 1
                const nextEmployeeId = maxEmployeeId ? maxEmployeeId + 1 : 1;
                const newEmployee = await models_1.Employees.create({
                    employeeId: nextEmployeeId,
                    firstName,
                    lastName,
                    position,
                    salary,
                    hireDate,
                    departmentId,
                });
                res.status(201).json(newEmployee);
            }
            catch (e) {
                res.status(500).json({
                    error: e.message,
                });
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { offset, limit } = req.query;
                if (!offset || !limit)
                    throw new Error('Does not exist offset or limit!');
                if (typeof offset !== 'string' || typeof limit !== 'string') {
                    throw new Error('Offset or limit must be 1 arguments!');
                }
                const offsetNum = Number(offset);
                const limitNum = Number(limit);
                if (isNaN(offsetNum) || isNaN(limitNum))
                    throw new Error('Offset or limit is not a number!');
                const query = `
        SELECT 
          "employee_id" AS "employeeId",
          "first_name" AS "firstName",
          "last_name" AS "lastName",
          "position",
          "salary",
          "hire_date" AS "hireDate",
          "department_id" AS "departmentId" 
        FROM "employees" 
        AS "Employees" 
        LIMIT :limitNum 
        OFFSET :offsetNum
      `;
                const employees = await dbConnect_1.sequelize.query(query, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { limitNum, offsetNum },
                });
                employees.forEach((employee) => {
                    employee.salary = Number(employee.salary);
                });
                const count = await models_1.Employees.count();
                const hasMore = limitNum + offsetNum < count;
                res.json({ employees, hasMore });
            }
            catch (e) {
                res.status(500).json({
                    error: e.message,
                });
            }
        };
        this.findOne = (req, res) => { };
        this.update = async (req, res) => {
            const employeeId = req.params.employeeId;
            const updates = req.body;
            try {
                // Найдем сотрудника, которого нужно удалить
                const employeeToUpdate = await models_1.Employees.findByPk(employeeId);
                if (!employeeToUpdate) {
                    // Если сотрудник не найден, вернем 404 Not Found
                    res.status(404).json({
                        error: 'Сотрудник не найден',
                    });
                    return;
                }
                await employeeToUpdate.update(updates);
                res.status(200).json({ employee: employeeToUpdate });
            }
            catch (e) {
                res.status(500).json({
                    error: e.message,
                });
            }
        };
        this.deleteOne = async (req, res) => {
            const employeeIdToDelete = req.params.employeeId;
            try {
                // Найдем сотрудника, которого нужно удалить
                const employeeToDelete = await models_1.Employees.findByPk(employeeIdToDelete);
                if (!employeeToDelete) {
                    // Если сотрудник не найден, вернем 404 Not Found
                    res.status(404).json({
                        error: 'Сотрудник не найден',
                    });
                    return;
                }
                // Удаление сотрудника
                await employeeToDelete.destroy();
                res.status(204).send(); // Возвращаем статус 204 No Content после успешного удаления
            }
            catch (e) {
                res.status(500).json({
                    error: e.message,
                });
            }
        };
        this.deleteAll = (req, res) => { };
    }
}
exports.EmployeesController = EmployeesController;
//# sourceMappingURL=employees.controller.js.map