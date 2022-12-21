import * as express from 'express';
import * as cors from 'cors';
import mongoose from 'mongoose';
import tripRouter from './routers/tripRouter';
import { DB_URL } from './db/db.constants';
import { mongooseConnectOptions } from './db/db-connect.config';

const PORT = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('static'));
app.use('/api', tripRouter);

const dbUri = process.env.MONGODB_URI || DB_URL

async function startApp() {
  try {
    await mongoose.connect(dbUri, mongooseConnectOptions, () => {
      console.log('connected');
    });
    app.listen(PORT, () => console.log(`Started at port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

void startApp();
