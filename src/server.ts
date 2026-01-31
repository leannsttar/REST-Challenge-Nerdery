import 'reflect-metadata';
import express from 'express';
import { router } from './router';
import { errorHandler } from './middlewares/error.middleware';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router());
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
