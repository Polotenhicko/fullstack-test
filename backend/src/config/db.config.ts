import { Options } from "sequelize";

export const dbConfig: Options = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  dialect: "postgres",
};
