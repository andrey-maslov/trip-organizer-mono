import fastify from 'fastify';
import mongoose from 'mongoose';
import { DB_URL } from './db/db.constants';
import { mongooseConnectOptions } from './db/db-connect.config';
import tripController from './controllers/TripController';

const PORT = process.env.PORT || 3333;

const server = fastify({ logger: true });

const dbUri = process.env.MONGODB_URI || DB_URL;

server.get('/api/trips', tripController.getAll);
server.get('/api/trips/:id', tripController.getOne);
server.post('/api/trips', tripController.create);
server.put('/api/trips', tripController.update);
server.delete('/api/trips/:id', tripController.delete);

// Health check
server.get('/api/health', async (req, res) =>
  res.status(200).send('Works fine')
);
server.get('/api/health/vars', async (req, res) =>
  res.status(200).send({
    port: PORT,
    env: process.env.NODE_ENV,
    dbUri,
    dbConnectionState: mongoose.connection.readyState,
  })
);

async function startApp() {
  try {
    await mongoose.connect(dbUri, mongooseConnectOptions, () => {
      console.log('db connected');
    });
    server.listen({ port: +PORT, host: '0.0.0.0' }, () =>
      console.log(`Started at port ${PORT}`)
    );
  } catch (err) {
    // fastify.log.error(err);
    console.log('Error:', err);
    process.exit(1);
  }
}

void startApp();
