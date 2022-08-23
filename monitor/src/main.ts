import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readBenchmarkConfig } from 'src/utils/config';
import { EVMMonitor } from 'src/service/web3/EVMMonitor';
import {
  onBoardInfluxDB,
  recreateBucket,
  writePoints,
} from './service/influxDB';
import { Point } from '@influxdata/influxdb-client';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const config = readBenchmarkConfig();

  await onBoardInfluxDB();

  await recreateBucket();

  const monitor = new EVMMonitor(config.provider);

  monitor.start();

  monitor.onNewBlock = async (block) => {
    const point = new Point('block')
      .tag('benchmark', 'monitor')
      .uintField('value', block.transactions.length)
      .timestamp(new Date(Number(block.timestamp) * 1000));
    await writePoints([point]);
  };
}

bootstrap();
