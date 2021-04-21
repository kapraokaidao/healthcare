
  ## Description
This is a backend for the Healthcare Token Based on Blockchain project. It is used as a backend for NHSO web application, Hospital web application and Patient mobile application.

## Installation

**1. Set up env**
```
NODE_ENV=production
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
STELLAR_URL=https://horizon-testnet.stellar.org
STELLAR_ACCOUNT=https://friendbot.stellar.org
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_ENDPOINT=
AWS_S3_KYC_BUCKET=
SENTRY_DSN=
SENTRY_ENABLE=
STELLAR_ISSUING_SECRET=
STELLAR_RECEIVING_SECRET=
SMS_SERVICE_URL=
SMS_ENABLE=
```
**2. Install dependencies**
```
yarn
```
**2. Build project**
```
yarn build
```


## Running the app
```
yarn start:prod
```