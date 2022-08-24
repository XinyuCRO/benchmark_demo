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

    const points: Point[] = [];
    for (const tx of block.transactions) {
      const point = new Point('transaction')
        .tag('benchmark', 'monitor')
        .stringField('blockHush', tx.blockHash)
        .uintField('blockNumber', tx.blockNumber)
        .stringField('from', tx.from)
        .stringField('to', tx.to)
        .uintField('gas', tx.gas)
        .stringField('gasPrice', tx.gasPrice)
        .uintField('nonce', tx.nonce)
        .stringField('hash', tx.hash)
        .stringField('value', tx.value)
        .timestamp(new Date(Number(block.timestamp) * 1000));

      points.push(point);
    }
    await writePoints(points);
  };
}

bootstrap();
