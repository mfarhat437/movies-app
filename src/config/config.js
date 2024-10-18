module.exports = {
  port: process.env.SERVICE_PORT,
  NODE_ENV: 'local',
  storage: {
  },
  app: {
    version: process.env.ADMIN_BE_APP_VERSION,
    name: 'Sales',
  },
  db: {
    url: process.env.ADMIN_BE_DB_URI
  },
  auth: {
    local: {
      key: process.env.ADMIN_BE_AUTH_LOCAL_KEY
    },
  },
  TMDB_config:{
    apiKey:process.env.TMDB_API_KEY
  },
  services: {
  },
};
