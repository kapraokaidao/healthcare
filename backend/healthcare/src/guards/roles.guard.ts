import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  RequestMethod,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";
import { METHOD_METADATA, PATH_METADATA } from "@nestjs/common/constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicAPI = this.reflector.getAllAndOverride<boolean>("isPublicAPI", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublicAPI) {
      return true;
    }

    const roles = this.reflector.getAllAndMerge<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    if (!roles.includes(request.user.role)) {
      const path = this.reflector.get<string>(PATH_METADATA, context.getHandler());
      const cPath = this.reflector.get<string>(PATH_METADATA, context.getClass());
      const methodNum = this.reflector.get<number>(METHOD_METADATA, context.getHandler());
      const method = Object.keys(RequestMethod).find(
        (key) => RequestMethod[key] === methodNum
      );
      throw new ForbiddenException(
        `${request.user.role} role is not allowed on ${method} ${cPath}/${path}`
      );
    }
    return true;
  }
}
