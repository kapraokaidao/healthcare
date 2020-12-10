import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as helmet from 'helmet';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SentryInterceptor } from './interceptors/sentry.interceptor';

async function bootstrap() {
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  const configService: ConfigService = app.get(ConfigService);

  Sentry.init({
    dsn: configService.get<string>('sentry.dsn'),
    enabled: configService.get<boolean>('sentry.enable'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app: expressApp }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(Sentry.Handlers.tracingHandler());
  app.useGlobalInterceptors(new SentryInterceptor());

  app.use(helmet());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Healthcare Backend')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('port'));
}

bootstrap();
