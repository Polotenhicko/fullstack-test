import * as express from 'express';
import { DepartmentsController } from '../controllers';

const departmentsRouter = express.Router();
const departmentsController = new DepartmentsController();

departmentsRouter.get('/departments', departmentsController.findAll);
departmentsRouter.post('/departments', departmentsController.create);
departmentsRouter.delete('/departments/:departmentId', departmentsController.deleteOne);
departmentsRouter.patch('/departments/:departmentId', departmentsController.update);

export { departmentsRouter };
