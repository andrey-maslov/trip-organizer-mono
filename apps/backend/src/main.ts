import * as express from 'express';
import mongoose from 'mongoose';
import tripRouter from './routers/tripRouter';
import { DB_URL_LOCAL } from './db/db.constants';
import { mongooseConnectOptions } from './db/db-connect.config';

const PORT = process.env.port || 3333;

const app = express();

app.use(express.json());
app.use(express.static('static'));
app.use('/api', tripRouter);

async function startApp() {
  try {
    await mongoose.connect(DB_URL_LOCAL, mongooseConnectOptions, () => {
      console.log('connected');
    });
    app.listen(PORT, () => console.log(`Started at port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

void startApp();
