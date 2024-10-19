module.exports = {
  port: process.env.SERVICE_PORT,
  NODE_ENV: 'local',
  syncDate:'0 0 * * *',
  storage: {
  },
  app: {
    version: process.env.ADMIN_BE_APP_VERSION,
    name: 'Movies',
  },
  db: {
    url: process.env.MOVIES_DB_URI
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
