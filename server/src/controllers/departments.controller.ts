import { Request, Response } from 'express';
import { sequelize } from '../models/dbConnect';
import { IDepartment } from '../../../shared/types';
import { Departments } from '../models';
import { QueryTypes } from 'sequelize';

export class DepartmentsController {
  create = async (req: Request, res: Response) => {
    try {
      const newDepartment = await Departments.create(req.body);

      res.status(201).json(newDepartment);
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
          "department_id" AS "departmentId",
          "department_name" AS "departmentName",
          "manager_id" AS "managerId",
          "budget",
          "establishment_year" AS "establishmentYear",
        FROM "departments" 
        AS "Departments" 
        LIMIT :limitNum 
        OFFSET :offsetNum
      `;

      const departments = await sequelize.query<IDepartment>(query, {
        type: QueryTypes.SELECT,
        replacements: { limitNum, offsetNum },
      });

      departments.forEach((employee) => {
        employee.budget = Number(employee.budget);
      });

      const count = await Departments.count();
      const hasMore = limitNum + offsetNum < count;

      res.json({ departments, hasMore });
    } catch (e: any) {
      res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };

  findOne = (req: Request, res: Response) => {};

  update = async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;
    const updates = req.body;

    try {
      // Найдем сотрудника, которого нужно удалить
      const departmentToUpdate = await Departments.findByPk(departmentId);

      if (!departmentToUpdate) {
        // Если сотрудник не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Отдел не найден',
        });
        return;
      }

      await departmentToUpdate.update(updates);

      res.status(200).json({ employee: departmentToUpdate });
    } catch (e: any) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteOne = async (req: Request, res: Response) => {
    const departmentIdToDelete = req.params.departmentId;

    try {
      // Найдем сотрудника, которого нужно удалить
      const departmentToDelete = await Departments.findByPk(departmentIdToDelete);

      if (!departmentToDelete) {
        // Если сотрудник не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Отдел не найден',
        });
        return;
      }

      // Удаление сотрудника
      await departmentToDelete.destroy();

      res.status(204).send(); // Возвращаем статус 204 No Content после успешного удаления
    } catch (e: any) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteAll = (req: Request, res: Response) => {};
}
