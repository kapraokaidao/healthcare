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
  private readonly stellarIssuingSecret;
  private readonly stellarReceivingSecret;

  constructor(private readonly configService: ConfigService) {
    this.stellarAccount = this.configService.get<string>("stellar.account");
    this.stellarUrl = this.configService.get<string>("stellar.url");
    this.stellarIssuingSecret = this.configService.get<string>("stellar.issuingSecret");
    this.stellarReceivingSecret = this.configService.get<string>("stellar.receivingSecret");
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
    name: string,
    amount: number
  ): Promise<{issuingPublicKey: string, receivingPublicKey: string}> {
    const server = new StellarSdk.Server(this.stellarUrl);

    const issuingKeys = StellarSdk.Keypair.fromSecret(this.stellarIssuingSecret);
    const receivingKeys = StellarSdk.Keypair.fromSecret(this.stellarReceivingSecret);

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
        receivingPublicKey: receivingKeys.publicKey()
      }
    } catch (e) {
      throw e;
    }
  }
}
