const { isDevelopment } = require('../constants/api');

const dialectOptions = isDevelopment
  ? undefined
  : {
      ssl: {
        require: true,
        rejectUnauthorized: false, // На практике это не рекомендуется, лучше настроить сервер PostgreSQL правильно
      },
      sslmode: 'require',
    };

module.exports = {
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  dialect: 'postgres',
  dialectOptions,
};
