const { allowOriginDev, allowOriginProd, isDevelopment } = require('../constants/api');

module.exports = {
  origin: isDevelopment ? allowOriginDev : allowOriginProd,
};
