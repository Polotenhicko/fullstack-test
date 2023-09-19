"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesRouter = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const employeesRouter = express.Router();
exports.employeesRouter = employeesRouter;
const employeesController = new controllers_1.EmployeesController();
employeesRouter.get('/employees', employeesController.findAll);
employeesRouter.post('/employees', employeesController.create);
employeesRouter.delete('/employees/:employeeId', employeesController.deleteOne);
employeesRouter.patch('/employees/:employeeId', employeesController.update);
//# sourceMappingURL=employees.route.js.map