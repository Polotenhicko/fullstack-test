"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesController = void 0;
const models_1 = require("../models");
class EmployeesController {
    constructor() {
        this.create = (req, res) => { };
        this.findAll = async (req, res) => {
            try {
                const data = await models_1.Employees.findAll();
                res.json(data);
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