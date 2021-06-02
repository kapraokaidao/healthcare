
## Description

**Healthcare Backend**
```
apt update
apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt install -y nodejs
npm install -g yarn
cp .env ./healthcare/backend/healthcare/.env
cd healthcare/backend/healthcare
yarn install
yarn script scripts/createNhso.ts
yarn build
yarn start:prod
```

**SMS Service Backend**
```

```


**NHSO Frontend**
```
apt update
apt install -y libtool
git clone https://github.com/kapraokaidao/healthcare.git
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt install -y nodejs
npm install -g yarn
cp .env ./healthcare/backend/healthcare/.env
cd healthcare/backend/healthcare
yarn install
yarn script scripts/createNhso.ts
yarn build
yarn start:prod
```

**Hospital Frontend**
```

```