import { NestFactory, Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as helmet from "helmet";
import * as Sentry from "@sentry/node";
import { AppModule } from "./app.module";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { SentryInterceptor } from "./interceptors/sentry.interceptor";
import { EntityNotFoundFilter } from "./exception-filters/entity-not-found.filter";
import { ValidationPipe } from "@nestjs/common";
import { SanitizationPipe } from "./pipes/sanitization.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();

  Sentry.init({
    dsn: configService.get<string>("sentry.dsn"),
    enabled: configService.get<boolean>("sentry.enable"),
  });
  app.useGlobalInterceptors(new SentryInterceptor());
  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalPipes(
    new SanitizationPipe({
      transform: true,
    }),
    new ValidationPipe({ skipMissingProperties: true })
  );

  const options = new DocumentBuilder()
    .setTitle("Healthcare Backend")
    .setVersion("0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  app.use(helmet());
  await app.listen(configService.get<number>("port"));
}

bootstrap();
