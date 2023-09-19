require('dotenv').config({ path: `.env.${process.env.NODE_ENV}.local` });
import * as express from 'express';
import * as cors from 'cors';
import { employeesRouter } from './routes';
import { port } from './constants/api';
import { corsConfig } from './config/cors.config';

const app = express();

// config
app.use(cors(corsConfig));
app.use(express.json());
// routes
app.use(employeesRouter);

app.listen(port, () => console.log(`Running on port ${port}`));
