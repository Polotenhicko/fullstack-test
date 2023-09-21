exports.isDevelopment = process.env.NODE_ENV === 'development';
exports.port = process.env.PORT || 5000;
exports.allowOriginDev = 'http://localhost:3000';
exports.allowOriginProd = 'https://polotenhicko.github.io';
