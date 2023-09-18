import { Request, Response } from 'express';
import { sequelize } from '../models/dbConnect';
import { IEmployee } from '../../../shared/types';
import { Employees } from '../models';
import { QueryTypes } from 'sequelize';

export class EmployeesController {
  create = async (req: Request, res: Response) => {
    try {
      const { employeeId, firstName, lastName, position, salary, hireDate, departmentId } = req.body;

      const newEmployee = await Employees.create({
        employeeId,
        firstName,
        lastName,
        position,
        salary,
        hireDate,
        departmentId,
      });

      res.status(201).json(newEmployee);
    } catch (e: any) {
      res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };

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

      const employees = await sequelize.query<IEmployee>(query, {
        type: QueryTypes.SELECT,
        replacements: { limitNum, offsetNum },
      });

      employees.forEach((employee) => {
        employee.salary = Number(employee.salary);
      });

      const count = await Employees.count();
      const hasMore = limitNum + offsetNum < count;

      res.json({ employees, hasMore });
    } catch (e: any) {
      res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };

  findOne = (req: Request, res: Response) => {};

  update = (req: Request, res: Response) => {};

  deleteOne = async (req: Request, res: Response) => {
    const employeeIdToDelete = req.params.employeeId;

    try {
      // Найдем сотрудника, которого нужно удалить
      const employeeToDelete = await Employees.findByPk(employeeIdToDelete);

      if (!employeeToDelete) {
        // Если сотрудник не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Сотрудник не найден',
        });
        return;
      }

      // Удаление сотрудника
      await employeeToDelete.destroy();

      res.status(204).send(); // Возвращаем статус 204 No Content после успешного удаления
    } catch (e: any) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteAll = (req: Request, res: Response) => {};
}
