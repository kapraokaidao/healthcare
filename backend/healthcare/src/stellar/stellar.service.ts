import { Injectable } from '@nestjs/common';
import StellarSdk from 'stellar-sdk';
import axios from 'axios';

@Injectable()
export class StellarService {
  async createAccount() {
    const pair = StellarSdk.Keypair.random();
    try {
      const response = await axios.get(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
      );
      const responseJSON = await response.data;
      const res = {
        Secret: pair.secret(),
        PublicKey: pair.publicKey(),
      };
      return res;
    } catch (e) {
      return 'ERROR!';
    }
  }

  async getBalanceBySecret(secret: string) {
    const pair = StellarSdk.Keypair.fromSecret(secret);
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(pair.publicKey());
    return account.balances;
  }

  async issueToken(
    issuingSecret: string,
    recevingSecret: string,
    serviceName: string,
    amount: number
  ) {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    const issuingKeys = StellarSdk.Keypair.fromSecret(issuingSecret);
    const receivingKeys = StellarSdk.Keypair.fromSecret(recevingSecret);

    const serviceAsset = new StellarSdk.Asset(serviceName, issuingKeys.publicKey());

    await server
      .loadAccount(receivingKeys.publicKey())
      .then(function (receiver) {
        const transaction = new StellarSdk.TransactionBuilder(receiver, {
          fee: 100,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: serviceAsset,
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(receivingKeys);
        return server.submitTransaction(transaction);
      })
      .then(function () {
        return server.loadAccount(issuingKeys.publicKey());
      })
      .then(function (issuer) {
        const transaction = new StellarSdk.TransactionBuilder(issuer, {
          fee: 100,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: receivingKeys.publicKey(),
              asset: serviceAsset,
              amount: amount.toString(),
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(issuingKeys);
        return server.submitTransaction(transaction);
      })
      .catch(function (error) {
        return error;
      });

    return 'Successful';
  }
}
