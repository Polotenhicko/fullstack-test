"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsConfig = void 0;
const api_1 = require("../constants/api");
exports.corsConfig = {
    origin: api_1.isDevelopment ? api_1.allowOriginDev : api_1.allowOriginProd,
};
//# sourceMappingURL=cors.config.js.map