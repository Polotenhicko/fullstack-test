"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentsController = void 0;
const dbConnect_1 = require("../models/dbConnect");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class DepartmentsController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const newDepartment = await models_1.Departments.create(req.body);
                res.status(201).json(newDepartment);
            }
            catch (e) {
                res.status(500).json({
                    error: true,
                    message: e.message,
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
          "department_id" AS "departmentId",
          "department_name" AS "departmentName",
          "manager_id" AS "managerId",
          "budget",
          "establishment_year" AS "establishmentYear"
        FROM "departments" 
        AS "Departments" 
        LIMIT :limitNum 
        OFFSET :offsetNum
      `;
                const departments = await dbConnect_1.sequelize.query(query, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { limitNum, offsetNum },
                });
                departments.forEach((employee) => {
                    employee.budget = Number(employee.budget);
                });
                const count = await models_1.Departments.count();
                const hasMore = limitNum + offsetNum < count;
                res.json({ departments, hasMore });
            }
            catch (e) {
                res.status(500).json({
                    error: true,
                    message: e.message,
                });
            }
        };
        this.findOne = (req, res) => { };
        this.update = async (req, res) => {
            const departmentId = req.params.departmentId;
            const updates = req.body;
            try {
                // Найдем сотрудника, которого нужно удалить
                const departmentToUpdate = await models_1.Departments.findByPk(departmentId);
                if (!departmentToUpdate) {
                    // Если сотрудник не найден, вернем 404 Not Found
                    res.status(404).json({
                        error: 'Отдел не найден',
                    });
                    return;
                }
                await departmentToUpdate.update(updates);
                res.status(200).json({ employee: departmentToUpdate });
            }
            catch (e) {
                res.status(500).json({
                    error: e.message,
                });
            }
        };
        this.deleteOne = async (req, res) => {
            const departmentIdToDelete = req.params.departmentId;
            try {
                // Найдем сотрудника, которого нужно удалить
                const departmentToDelete = await models_1.Departments.findByPk(departmentIdToDelete);
                if (!departmentToDelete) {
                    // Если сотрудник не найден, вернем 404 Not Found
                    res.status(404).json({
                        error: 'Отдел не найден',
                    });
                    return;
                }
                // Удаление сотрудника
                await departmentToDelete.destroy();
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
exports.DepartmentsController = DepartmentsController;
//# sourceMappingURL=departments.controller.js.map