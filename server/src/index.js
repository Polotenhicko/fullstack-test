require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
const express = require('express');
const cors = require('cors');
const corsConfig = require('./config/cors.config');
const { departmentsRouter, employeesRouter } = require('./routes');
const { port } = require('./constants/api');

const app = express();

// config
app.use(cors(corsConfig));
app.use(express.json());
// routes
app.use(employeesRouter);
app.use(departmentsRouter);

app.listen(port, () => console.log(`Running on port ${port}`));
