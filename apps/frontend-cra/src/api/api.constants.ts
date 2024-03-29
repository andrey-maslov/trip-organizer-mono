const apiPathProd = 'https://trip-organizer-api.up.railway.app';
const apiPathDev = 'http://localhost:3333';

const isDev = process.env.NODE_ENV === 'development';

const baseApiPath = isDev ? apiPathDev : apiPathProd;

export const API = {
  TRIPS: `${baseApiPath}/api/trips`,
  HEALTH: `${baseApiPath}/api/health`,
  VARS: `${baseApiPath}/api/health/vars`,
};
