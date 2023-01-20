# Trip-Organizer app

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

- To run only frontend: `nx serve frontend` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

- To run both front and back: `npm run start:all` or `nx run-many --parallel --target=serve --projects=backend,frontend-cra`

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## MongoDB
### Start locally (for development)
start: ```brew services start mongodb-community@6.0```

stop: ```brew services stop mongodb-community@6.0```

check if started: ```brew services list```

To connect and Use MongoDB open new terminal and run ```mongosh```. Then you can use this CLI or Compass

[Documentation (MacOS)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)

## Production
Deploy to [railway.app](https://railway.app/) both frontend and backend
### Frontend (frontend-cra)
- Build command: ``npx nx build frontend-cra --prod``
- Start command: ``npx serve -s dist/apps/frontend-cra``
### Backend
- Build command: ``npx nx build backend --prod``
- Start command: ``node dist/apps/backend/main.js``

## Useful links
[Video about NX.js](https://www.youtube.com/watch?v=VUyBY72mwrQ)
[Video about NX.js 2](https://www.youtube.com/watch?v=1eHlaVoeDfU)

[Building Full-Stack React Applications in a Monorepo](https://blog.nrwl.io/building-full-stack-react-applications-in-a-monorepo-7dfa1714b988)

[Пишем продвинутый планировщик с использованием React, Nest и NX. Часть 1: настройка проекта](https://habr.com/ru/company/domclick/blog/672546/)

[Пишем продвинутый планировщик с использованием React, Nest и NX. Часть 2: аутентификация](https://habr.com/ru/company/domclick/blog/687106/)

[React Query full guide](https://my-js.org/docs/guide/react-query/)

[React Query TS](https://tkdodo.eu/blog/react-query-and-type-script)

[Fastify 1](https://www.section.io/engineering-education/fastify-fauna-nodejs/)

[Fastify 2](https://dev.to/itsrennyman/how-i-structure-my-fastify-application-1j93)
