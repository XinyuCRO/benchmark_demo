import { BenchmarkConfig } from 'src/types';
import * as fs from 'fs';
import { BenchmarkConfigPath } from 'src/types/consts';
import { Logger } from '@nestjs/common';
import { exit } from 'process';

export function readBenchmarkConfig(): BenchmarkConfig {
  let config: BenchmarkConfig;
  try {
    config = JSON.parse(fs.readFileSync(BenchmarkConfigPath).toString());
  } catch (error) {
    Logger.error(
      `Can not read config from ${BenchmarkConfigPath}. Please check if the file exists and is valid JSON.`,
      error,
    );
    exit(-1);
  }
  return config;
}
