"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
const express = require("express");
const cors = require("cors");
const routes_1 = require("./routes");
const api_1 = require("./constants/api");
const cors_config_1 = require("./config/cors.config");
const app = express();
// config
app.use(cors(cors_config_1.corsConfig));
app.use(express.json());
// routes
app.use(routes_1.employeesRouter);
app.use(routes_1.departmentsRouter);
app.listen(api_1.port, () => console.log(`Running on port ${api_1.port}`));
//# sourceMappingURL=index.js.map