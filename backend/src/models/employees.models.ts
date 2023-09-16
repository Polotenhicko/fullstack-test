import { DataTypes } from 'sequelize';
import { sequelize } from './dbConnect';
import { Departments } from './departments.model';

export const Employees = sequelize.define(
  'Employees',
  {
    employeeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'employee_id',
    },
    firstName: {
      type: DataTypes.STRING(255),
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(255),
      field: 'last_name',
    },
    position: {
      type: DataTypes.STRING(255),
      field: 'position',
    },
    salary: {
      type: DataTypes.NUMBER,
      field: 'salary',
    },
    hireDate: {
      type: DataTypes.DATE,
      field: 'hire_date',
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Departments,
        key: 'department_id',
      },
      field: 'department_id',
    },
  },
  {
    tableName: 'employees', // Указываем имя таблицы
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
  }
);

Employees.hasOne(Departments, { foreignKey: 'department_id' });
