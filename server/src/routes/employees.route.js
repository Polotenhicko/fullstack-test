const express = require('express');
const { EmployeesController } = require('../controllers');

const employeesRouter = express.Router();
const employeesController = new EmployeesController();

employeesRouter.get('/employees', employeesController.findAll);
employeesRouter.post('/employees', employeesController.create);
employeesRouter.delete('/employees/:employeeId', employeesController.deleteOne);
employeesRouter.patch('/employees/:employeeId', employeesController.update);

module.exports = employeesRouter;
