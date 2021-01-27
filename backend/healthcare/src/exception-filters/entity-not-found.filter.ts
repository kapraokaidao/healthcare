import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Response } from "express";
import { EntityNotFoundError } from "typeorm/error/EntityNotFoundError";
import { constants } from "http2";

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const name = exception.name;
    // const request = ctx.getRequest<Request>();
    // const tableName = exception.message.split(`"`)[1];

    response.status(constants.HTTP_STATUS_NOT_FOUND).json({
      name,
      description: "The relevant resource cannot be found",
    });
  }
}
