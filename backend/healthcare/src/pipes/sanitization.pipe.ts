import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { sanitize } from "class-sanitizer";

@Injectable()
export class SanitizationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    sanitize(value);
    return value;
  }
}
