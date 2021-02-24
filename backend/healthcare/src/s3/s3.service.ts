import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service {
  private s3;
  private kycBucketName;

  constructor(private configService: ConfigService) {
    this.kycBucketName = this.configService.get("aws.s3.kycBucket");
    this.initS3();
  }

  initS3() {
    const options: ServiceConfigurationOptions = {
      region: this.configService.get<string>("aws.region"),
      accessKeyId: this.configService.get<string>("aws.accessKeyId"),
      secretAccessKey: this.configService.get<string>("aws.secretAccessKey"),
      endpoint: this.configService.get<string>("aws.s3.endpoint"),
    };
    AWS.config.update(options);
    this.s3 = new AWS.S3();
  }

  async uploadImage(file, path): Promise<string> {
    const params = {
      Bucket: this.kycBucketName,
      Key: path,
      Body: file.buffer,
    };
    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async deleteImage(path) {
    const params = {
      Bucket: this.kycBucketName,
      Key: path,
    };
    await this.s3.deleteObject(params).promise();
  }
}
