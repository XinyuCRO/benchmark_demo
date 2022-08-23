import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readBenchmarkConfig } from 'src/utils/config';
import { EVMMonitor } from 'src/service/web3/EVMMonitor';
import { onBoardInfluxDB, writePoint } from './service/influxDB';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const config = readBenchmarkConfig();

  await onBoardInfluxDB();

  await writePoint();

  const monitor = new EVMMonitor(config.provider);

  monitor.start();
}

bootstrap();
