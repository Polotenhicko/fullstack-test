import { Options } from 'sequelize';
const { Pool } = require('pg');

export const dbConfig: Options = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
};
