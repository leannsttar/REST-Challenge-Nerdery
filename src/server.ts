import express from 'express';
import 'reflect-metadata';
import { router } from './router';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router(app))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
