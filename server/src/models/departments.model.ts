import { DataTypes } from 'sequelize';
import { sequelize } from './dbConnect';

export const Departments = sequelize.define(
  'Department',
  {
    departmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'department_id',
    },
    departmentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'department_name',
    },
    managerId: {
      type: DataTypes.INTEGER,
      field: 'manager_id',
    },
    budget: {
      type: DataTypes.NUMBER,
      field: 'budget',
    },
    establishmentYear: {
      type: DataTypes.INTEGER,
      field: 'establishment_year',
    },
  },
  {
    tableName: 'departments', // Указываем имя таблицы
    timestamps: false, // Если не нужно хранить временные метки создания и обновления
  }
);
