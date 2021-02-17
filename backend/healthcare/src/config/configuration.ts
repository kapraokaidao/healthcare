export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DB_HOST,
    post: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3: {
      endpoint: process.env.AWS_S3_ENDPOINT,
      kycBucket: process.env.AWS_S3_KYC_BUCKET,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  stellar: {
    url: process.env.STELLAR_URL,
    account: process.env.STELLAR_ACCOUNT,
    issuingSecret: process.env.STELLAR_ISSUING_SECRET,
    receivingSecret: process.env.STELLAR_RECEIVING_SECRET,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    enable: process.env.SENTRY_ENABLE === "true",
  },
  sms: {
    enable: process.env.SMS_ENABLE === "true",
    serviceUrl: process.env.SMS_SERVICE_URL
  },
});
