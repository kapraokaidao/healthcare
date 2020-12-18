import { Injectable, InternalServerErrorException } from "@nestjs/common";
import StellarSdk, { Horizon } from "stellar-sdk";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import BalanceLine = Horizon.BalanceLine;
import { CreateAccountResponse } from "./stellar.dto";

@Injectable()
export class StellarService {
  private readonly stellarAccount;
  private readonly stellarUrl;

  constructor(private readonly configService: ConfigService) {
    this.stellarAccount = this.configService.get<string>("stellar.account");
    this.stellarUrl = this.configService.get<string>("stellar.url");
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
    const server = new StellarSdk.Server(this.stellarUrl);
    const account = await server.loadAccount(pair.publicKey());
    return account.balances;
  }

  async issueToken(
    issuingSecret: string,
    receivingSecret: string,
    name: string,
    amount: number
  ): Promise<{ issuingPublicKey: string; receivingPublicKey: string }> {
    const server = new StellarSdk.Server(this.stellarUrl);

    const issuingKeys = StellarSdk.Keypair.fromSecret(issuingSecret);
    const receivingKeys = StellarSdk.Keypair.fromSecret(receivingSecret);

    const serviceAsset = new StellarSdk.Asset(name, issuingKeys.publicKey());
    try {
      /** begin allowing trust transaction */
      const receiver = await server.loadAccount(receivingKeys.publicKey());
      const allowTrustTransaction = new StellarSdk.TransactionBuilder(receiver, {
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
      const transferTransaction = new StellarSdk.TransactionBuilder(issuer, {
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
      return {
        issuingPublicKey: issuingKeys.publicKey(),
        receivingPublicKey: receivingKeys.publicKey(),
      };
    } catch (e) {
      throw e;
    }
  }

  async transferToken(
    sourceSecret: string,
    destinationSecret: string,
    name: string,
    issuerPublicKey: string,
    amount: number
  ): Promise<void> {
    const server = new StellarSdk.Server(this.stellarUrl);

    const sourceKeys = StellarSdk.Keypair.fromSecret(sourceSecret);
    const destinationKeys = StellarSdk.Keypair.fromSecret(destinationSecret);

    const serviceAsset = new StellarSdk.Asset(name, issuerPublicKey);

    try {
      /** begin allowing trust transaction */
      const receiver = await server.loadAccount(destinationKeys.publicKey());
      const allowTrustTransaction = new StellarSdk.TransactionBuilder(receiver, {
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
      allowTrustTransaction.sign(destinationKeys);
      await server.submitTransaction(allowTrustTransaction);
      /** begin transfer transaction */
      const source = await server.loadAccount(sourceKeys.publicKey());
      const transferTransaction = new StellarSdk.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationKeys.publicKey(),
            asset: serviceAsset,
            amount: amount.toString(),
          })
        )
        .setTimeout(100)
        .build();
      transferTransaction.sign(sourceKeys);
      await server.submitTransaction(transferTransaction);
    } catch (e) {
      throw e;
    }
  }
}
