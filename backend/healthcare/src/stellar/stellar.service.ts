import { Injectable, InternalServerErrorException } from '@nestjs/common';
import StellarSdk, { Horizon } from 'stellar-sdk';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import BalanceLine = Horizon.BalanceLine;
import { CreateAccountResponse } from './stellar.dto';

@Injectable()
export class StellarService {
  private readonly stellarAccount;
  private readonly stellarUrl;

  constructor(private readonly configService: ConfigService) {
    this.stellarAccount = this.configService.get<string>('stellar.account');
    this.stellarUrl = this.configService.get<string>('stellar.url');
  }
  async createAccount(): Promise<CreateAccountResponse> {
    const pair = StellarSdk.Keypair.random();
    try {
      const { data } = await axios.get(
        `${this.stellarAccount}?addr=${encodeURIComponent(pair.publicKey())}`
      );
      const res = {
        secret: pair.secret(),
        publicKey: pair.publicKey(),
      };
      return res;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getBalanceBySecret(secret: string): Promise<BalanceLine[]> {
    const pair = StellarSdk.Keypair.fromSecret(secret);
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(pair.publicKey());
    return account.balances;
  }

  async issueToken(
    issuingSecret: string,
    receivingSecret: string,
    serviceName: string,
    amount: number
  ): Promise<void> {
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    const issuingKeys = StellarSdk.Keypair.fromSecret(issuingSecret);
    const receivingKeys = StellarSdk.Keypair.fromSecret(receivingSecret);

    const serviceAsset = new StellarSdk.Asset(serviceName, issuingKeys.publicKey());
    try {
      /** begin allowing trust transaction */
      const receiver = await server.loadAccount(receivingKeys.publicKey());
      let allowTrustTransaction = new StellarSdk.TransactionBuilder(receiver, {
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
      allowTrustTransaction.sign(receivingKeys);
      await server.submitTransaction(allowTrustTransaction);
      /** begin transfer transaction */
      const issuer = await server.loadAccount(issuingKeys.publicKey());
      let transferTransaction = new StellarSdk.TransactionBuilder(issuer, {
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
      transferTransaction.sign(issuingKeys);
      await server.submitTransaction(transferTransaction);
    } catch (e) {
      throw e;
    }
  }
}
