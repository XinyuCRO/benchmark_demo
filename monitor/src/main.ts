import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readBenchmarkConfig } from './utils/config';
import { getLatestBlockNumber } from './web3';
import { EVMMonitor } from './web3/EVMMonitor';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const config = readBenchmarkConfig();

  const monitor = new EVMMonitor(config.provider);

  monitor.start();
}

bootstrap();
