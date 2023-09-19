import * as express from 'express';
import { DepartmentsController } from '../controllers';

const departmentsRouter = express.Router();
const departmentsController = new DepartmentsController();

departmentsRouter.get('/employees', departmentsController.findAll);
departmentsRouter.post('/employees', departmentsController.create);
departmentsRouter.delete('/employees/:employeeId', departmentsController.deleteOne);
departmentsRouter.patch('/employees/:employeeId', departmentsController.update);

export { departmentsRouter };
