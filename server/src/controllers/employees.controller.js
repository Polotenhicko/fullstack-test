const sequelize = require('../models/dbConnect');
const { Employees } = require('../models');
const { QueryTypes } = require('sequelize');

class EmployeesController {
  create = async (req, res) => {
    const { employeeId, firstName, lastName, position, salary, hireDate, departmentId } = req.body;
    try {
      const hasEmployeeByPK = await Employees.findByPk(employeeId);

      if (hasEmployeeByPK) {
        throw new Error(`employee_id ${employeeId} has ready exist!`);
      }

      const maxEmployeeId = await Employees.max('employeeId');

      // Если есть записи в таблице Departments, увеличиваем максимальное значение на 1, иначе начинаем с 1
      const nextEmployeeId = maxEmployeeId ? maxEmployeeId + 1 : 1;

      const newEmployee = await Employees.create({
        employeeId: nextEmployeeId,
        firstName,
        lastName,
        position,
        salary,
        hireDate,
        departmentId,
      });

      res.status(201).json(newEmployee);
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

      const employees = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { limitNum, offsetNum },
      });

      employees.forEach((employee) => {
        employee.salary = Number(employee.salary);
      });

      const count = await Employees.count();
      const hasMore = limitNum + offsetNum < count;

      res.json({ employees, hasMore });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  findOne = (req, res) => {};

  update = async (req, res) => {
    const employeeId = req.params.employeeId;
    const updates = req.body;

    try {
      // Найдем сотрудника, которого нужно обновить
      const employeeToUpdate = await Employees.findByPk(employeeId);

      if (!employeeToUpdate) {
        // Если сотрудник не найден, вернем 404 Not Found
        res.status(404).json({
          error: 'Сотрудник не найден',
        });
        return;
      }

      await employeeToUpdate.update(updates);

      res.status(200).json({ employee: employeeToUpdate });
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteOne = async (req, res) => {
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
    } catch (e) {
      res.status(500).json({
        error: e.message,
      });
    }
  };

  deleteAll = (req, res) => {};
}

module.exports = EmployeesController;
