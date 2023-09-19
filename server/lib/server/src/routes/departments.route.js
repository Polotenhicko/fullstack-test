"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentsRouter = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const departmentsRouter = express.Router();
exports.departmentsRouter = departmentsRouter;
const departmentsController = new controllers_1.DepartmentsController();
departmentsRouter.get('/employees', departmentsController.findAll);
departmentsRouter.post('/employees', departmentsController.create);
departmentsRouter.delete('/employees/:employeeId', departmentsController.deleteOne);
departmentsRouter.patch('/employees/:employeeId', departmentsController.update);
//# sourceMappingURL=departments.route.js.map