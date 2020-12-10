import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './interceptors/sentry.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  Sentry.init({
    dsn: configService.get<string>('sentry.dsn'),
    enabled: configService.get<boolean>('sentry.enable'),
  });

  app.use(helmet());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalInterceptors(new SentryInterceptor());
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
