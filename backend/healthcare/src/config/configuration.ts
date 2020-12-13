export default () => ({
  node_env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST,
    post: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  stellar: {
    url: process.env.STELLAR_URL,
    account: process.env.STELLAR_ACCOUNT,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    enable: process.env.SENTRY_ENABLE === "true",
  },
});
