const sequelize = require('../models/dbConnect');
const { Departments } = require('../models');
const { QueryTypes } = require('sequelize');

class DepartmentsController {
  create = async (req, res) => {
    const { departmentId, departmentName, managerId, budget, establishmentYear } = req.body;

    try {
      const hasDepartmentByPK = await Departments.findByPk(departmentId);

      if (hasDepartmentByPK) {
        throw new Error(`department_id ${departmentId} has ready exist!`);
      }

      const maxDepartmentId = await Departments.max('departmentId');

      // Если есть записи в таблице Departments, увеличиваем максимальное значение на 1, иначе начинаем с 1
      const nextDepartmentId = maxDepartmentId ? maxDepartmentId + 1 : 1;

      const newDepartment = await Departments.create({
        departmentId: nextDepartmentId,
        departmentName,
        managerId,
        budget,
        establishmentYear,
      });

      res.status(201).json(newDepartment);
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  findAll = async (req, res) => {
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
          "establishment_year" AS "establishmentYear"
        FROM "departments" 
        AS "Departments" 
        LIMIT :limitNum 
        OFFSET :offsetNum
      `;

      const departments = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { limitNum, offsetNum },
      });

      departments.forEach((department) => {
        department.budget = Number(department.budget);
      });

      const count = await Departments.count();
      const hasMore = limitNum + offsetNum < count;

      res.json({ departments, hasMore });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  findOne = (req, res) => {};

  update = async (req, res) => {
    const departmentId = req.params.departmentId;
    const updates = req.body;

    try {
      // Найдем отдел, которого нужно обновить
      const departmentToUpdate = await Departments.findByPk(departmentId);

      if (!departmentToUpdate) {
        // Если отдел не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Отдел не найден',
        });
        return;
      }

      await departmentToUpdate.update(updates);

      res.status(200).json({ department: departmentToUpdate });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteOne = async (req, res) => {
    const departmentIdToDelete = req.params.departmentId;

    try {
      // Найдем отдел, которого нужно удалить
      const departmentToDelete = await Departments.findByPk(departmentIdToDelete);

      if (!departmentToDelete) {
        // Если отдел не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Отдел не найден',
        });
        return;
      }

      // Очищаем
      await sequelize.query(
        'UPDATE Employees SET department_id = null WHERE department_id = :departmentIdToDelete',
        {
          replacements: { departmentIdToDelete },
          type: QueryTypes.UPDATE,
        }
      );

      // Удаление отдел
      await departmentToDelete.destroy();

      res.status(204).send(); // Возвращаем статус 204 No Content после успешного удаления
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteAll = (req, res) => {};
}

module.exports = DepartmentsController;
