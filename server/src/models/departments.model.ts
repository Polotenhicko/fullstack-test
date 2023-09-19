import { DataTypes } from 'sequelize';
import { sequelize } from './dbConnect';
import { Employees } from './employees.models';

export const Departments = sequelize.define(
  'Department',
  {
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    manager_id: {
      type: DataTypes.INTEGER,
    },
    budget: {
      type: DataTypes.NUMBER,
    },
    establishment_year: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'departments', // Указываем имя таблицы
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
  },
);
