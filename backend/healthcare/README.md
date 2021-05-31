## Requirements
- RAM >= 4GB (build application)
- S3 Bucket with IAM for S3 full access
- MySQL database with created schema
## Description
This is a backend for the Healthcare Token Based on Blockchain project. It is used as a backend for NHSO web application, Hospital web application and Patient mobile application.

## Installation

**1. Set up env**
```
NODE_ENV=development
PORT=
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
Note: To disable synchronize database automatically, use `NODE_ENV=production`

**2. Install dependencies**
```
yarn
```
**3. Build project**
```
yarn build
```
## Running the app
```
yarn start:prod
```
## Deploy with Docker
1. Prepare `.env` file as [step1 of installation](#installation)
2. Create Admin account by running:
```
docker run --env-file .\.env -it taan02991/healthcare-backend:latest node dist/scripts/createNhso.js
```
3. Serve application
```
docker run --env-file .\.env -p 80:3000 taan02991/healthcare-backend:latest
```
