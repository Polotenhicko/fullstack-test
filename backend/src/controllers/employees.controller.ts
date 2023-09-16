import { Request, Response } from 'express';
import { sequelize } from '../models/dbConnect';
import { IEmployee } from '../../../shared/types';
import { Employees } from '../models';

export class EmployeesController {
  create = (req: Request, res: Response) => {};

  findAll = async (req: Request, res: Response) => {
    try {
      const data = await Employees.findAll();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };

  findOne = (req: Request, res: Response) => {};

  update = (req: Request, res: Response) => {};

  deleteOne = (req: Request, res: Response) => {};

  deleteAll = (req: Request, res: Response) => {};
}
