const express = require('express');
const { DepartmentsController } = require('../controllers');

const departmentsRouter = express.Router();
const departmentsController = new DepartmentsController();

departmentsRouter.get('/departments', departmentsController.findAll);
departmentsRouter.post('/departments', departmentsController.create);
departmentsRouter.delete('/departments/:departmentId', departmentsController.deleteOne);
departmentsRouter.patch('/departments/:departmentId', departmentsController.update);

module.exports = departmentsRouter;
