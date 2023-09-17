import { Request, Response } from 'express';
import { sequelize } from '../models/dbConnect';
import { IEmployee } from '../../../shared/types';
import { Employees } from '../models';
import { QueryTypes } from 'sequelize';

export class EmployeesController {
  create = (req: Request, res: Response) => {};

  findAll = async (req: Request, res: Response) => {
    try {
      const { offset, limit } = req.query;
      if (!offset || !limit) throw new Error('Does not exist offset or limit!');
      if (typeof offset !== 'string' || typeof limit !== 'string') {
        throw new Error('Offset or limit must be 1 arguments!');
      }

      const offsetNum = Number(offset);
      const limitNum = Number(limit);

      if (isNaN(offsetNum) || isNaN(limitNum)) throw new Error('Offset or limit is not a number!');

      const query = `
        SELECT 
          "employee_id" AS "employeeId",
          "first_name" AS "firstName",
          "last_name" AS "lastName",
          "position",
          "salary",
          "hire_date" AS "hireDate",
          "department_id" AS "departmentId" 
        FROM "employees" 
        AS "Employees" 
        LIMIT :limitNum 
        OFFSET :offsetNum
      `;

      const data = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { limitNum, offsetNum },
      });

      const count = await Employees.count();
      const hasMore = limitNum + offsetNum < count;

      res.json({ data, hasMore });
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
