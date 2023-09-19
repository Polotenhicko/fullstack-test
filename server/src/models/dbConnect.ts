import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/db.config';

export const sequelize = new Sequelize(dbConfig);
