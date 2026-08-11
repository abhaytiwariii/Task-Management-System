import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let cachedApp: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
  return app;
}

// Vercel Serverless Function Execution
export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const app = await bootstrap();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cachedApp = app.getHttpAdapter().getInstance();
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  return cachedApp(req, res);
}

// Render or Local Execution
const isVercel = process.env.VERCEL === 'true' || process.env.VERCEL === '1';
if (!isVercel) {
  bootstrap()
    .then(async (app) => {
      const port = process.env.PORT || 3001;
      await app.listen(port);
      console.log(`Application is running on: ${await app.getUrl()}`);
    })
    .catch((err) => {
      console.error('Failed to start application', err);
    });
}
