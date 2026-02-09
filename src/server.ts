import 'reflect-metadata';
import express from 'express';
import { router } from './router';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config/env.config';


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router());
app.use(errorHandler)

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
