"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeesRouter = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const employeesRouter = express.Router();
exports.employeesRouter = employeesRouter;
const employeesController = new controllers_1.EmployeesController();
employeesRouter.get("/employees", employeesController.findAll);
//# sourceMappingURL=employees.route.js.map