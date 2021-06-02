# Required service
- MySQL
- S3

# Installation
```
Recommend AMI: Ubuntu Server 20.04 LTS (HVM), SSD Volume Type - ami-0d058fe428540cd89 (64-bit x86)
Minimum spec of EC2 is t2.small
Please allow TCP port 80 on EC2
```

## Healthcare Backend
1. ENV
```
NODE_ENV=development
PORT=80
DB_HOST=
DB_PORT=3306
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
2. Setup
```
sudo apt update
sudo apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
cp .env ./healthcare/backend/healthcare/.env
cd healthcare/backend/healthcare
yarn install
yarn script scripts/createNhso.ts
yarn build
yarn start:prod
```
3. Init hospital
```
Hospital database is store in ./backend/healthcare/healthcare_hospital.zip
```

## SMS Service Backend
1. ENV
```
example env
```
2. Setup
```
sudo apt update
sudo apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
cp .env ./healthcare/backend/healthcare/.env
cd healthcare/backend/healthcare
yarn install
yarn script scripts/createNhso.ts
yarn build
yarn start:prod
```

## NHSO Frontend
1. ENV
```
REACT_APP_BASE_URL=http://localhost:3000
```
2. Setup
```
sudo apt update
sudo apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
cp .env ./healthcare/frontend/nhso/.env
cd healthcare/frontend/nhso
yarn install
yarn build
sudo yarn global add serve
sudo serve -s build -l 80
```

## Hospital Frontend
1. ENV
```
REACT_APP_BASE_URL=http://localhost:3000
```
2. Setup
```
sudo apt update
sudo apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn
cp .env ./healthcare/frontend/hospital/.env
cd healthcare/frontend/hospital
yarn install
yarn build
sudo yarn global add serve
sudo serve -s build -l 80
```
