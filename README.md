# EVM Benchmark Tool Demo


## Folder Structure

- Generator
  - Generate load to the network
  - Generate accounts, fund accounts, send TX, manage nonce, etc
  - Write metrics to Collector
- Monitor
  - Monitor network status
  - Keep track of block, tx count, gas usage, account count, etc
  - Write metrics to Collector
- Collector
  - Collect metrics of generator & monitor produce
  - Analyze and plot chart based on metrics


## Pre-requirements

- Docker
- pnpm

## Quick start


Start collector docker images,

```bash
cd collector
docker-compose up -d
```

Start monitor,

```bash
cd monitor
pnpm install
pnpm start:dev
```

- Navigate to [http://localhost:3000](http://localhost:3000), enter `admin` and `admin` to login grafana.
- inside grafana, there is a dashboard named `Benchmark`, and you can see the charts.
