import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptions/http-global-exception.filter';
import { CustomLogger } from './logging/logger.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  // We set the bufferLogs to true to make sure all logs will be buffered until
  // a custom logger is attached
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Retrieving the singleton instance of the CustomLogger object
  app.useLogger(app.get(CustomLogger));

  process.on('uncaughtException', (error) => {
    Logger.error("Uncaught Exception:", error.message);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    Logger.error("Unhandled Rejection:", promise, 'reason:', reason);
  });

  const appConfig = app.get<ConfigService>(ConfigService);
  const PORT = Number(appConfig.get('PORT') || '4000');

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${PORT}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
  Logger.debug(`nodejs2024Q3-service application is runnning on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
