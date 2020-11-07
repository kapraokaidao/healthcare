import { Injectable } from '@nestjs/common';
import StellarSdk from 'stellar-sdk';
import axios from 'axios';

@Injectable()
export class StellarService {
  hello(id: string) {
    return `hello ${id}`;
  }
  
  async createAccount() {
    const pair = StellarSdk.Keypair.random();
    try {
      const response = await axios.get(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(
          pair.publicKey()
        )}`,
      );
      const responseJSON = await response.data;
      return pair.secret()
    } catch (e) {
      return "ERROR!";
    }
  }

  async getBalanceBySecret(secret: string) {
    var pair = StellarSdk.Keypair.fromSecret(
      secret,
    );
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");
    const account = await server.loadAccount(pair.publicKey());
    let ret: string = '';
    account.balances.forEach(function (balance) {
      ret += "Type:" + balance.asset_type +  ", Balance:" + balance.balance + '\n'
    });
    return ret;
  }
}
