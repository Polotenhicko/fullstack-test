import * as express from 'express';
import { EmployeesController } from '../controllers';

const employeesRouter = express.Router();
const employeesController = new EmployeesController();

employeesRouter.get('/employees', employeesController.findAll);
employeesRouter.post('/employees', employeesController.create);
employeesRouter.delete('/employees/:employeeId', employeesController.deleteOne);

export { employeesRouter };
