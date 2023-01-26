import { ConnectOptions } from 'mongoose';

const DB_LOGIN = '';
const DB_PASSWORD = '';
const DB_HOST = '';
const DB_PORT = '';
const DB_AUTHDATABASE = '';

export const mongoString = `mongodb://${DB_LOGIN}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_AUTHDATABASE}`;

export const mongooseConnectOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
} as ConnectOptions;
