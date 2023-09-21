"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentsRouter = void 0;
const express = require("express");
const controllers_1 = require("../controllers");
const departmentsRouter = express.Router();
exports.departmentsRouter = departmentsRouter;
const departmentsController = new controllers_1.DepartmentsController();
departmentsRouter.get('/departments', departmentsController.findAll);
departmentsRouter.post('/departments', departmentsController.create);
departmentsRouter.delete('/departments/:departmentId', departmentsController.deleteOne);
departmentsRouter.patch('/departments/:departmentId', departmentsController.update);
//# sourceMappingURL=departments.route.js.map