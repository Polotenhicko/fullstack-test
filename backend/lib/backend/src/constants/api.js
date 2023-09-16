"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowOriginProd = exports.allowOriginDev = exports.port = exports.isDevelopment = void 0;
exports.isDevelopment = process.env.NODE_ENV === 'development';
exports.port = process.env.PORT || 5000;
exports.allowOriginDev = 'http://localhost:3000';
exports.allowOriginProd = 'http://localhost:3000';
//# sourceMappingURL=api.js.map