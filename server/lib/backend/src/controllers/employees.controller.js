"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesController = void 0;
const dbConnect_1 = require("../models/dbConnect");
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
class EmployeesController {
    constructor() {
        this.create = (req, res) => { };
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
                const data = await dbConnect_1.sequelize.query(query, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { limitNum, offsetNum },
                });
                const count = await models_1.Employees.count();
                const hasMore = limitNum + offsetNum < count;
                res.json({ data, hasMore });
            }
            catch (e) {
                res.status(500).json({
                    error: true,
                    message: e.message,
                });
            }
        };
        this.findOne = (req, res) => { };
        this.update = (req, res) => { };
        this.deleteOne = (req, res) => { };
        this.deleteAll = (req, res) => { };
    }
}
exports.EmployeesController = EmployeesController;
//# sourceMappingURL=employees.controller.js.map