import * as express from "express";
import { EmployeesController } from "../controllers";

const employeesRouter = express.Router();
const employeesController = new EmployeesController();

employeesRouter.get("/employees", employeesController.findAll);

export { employeesRouter };
