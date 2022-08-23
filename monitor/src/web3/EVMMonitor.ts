import { Logger, SerializeOptions } from '@nestjs/common';
import { delay } from 'src/utils/delay';
import { clearInterval } from 'timers';
import Web3 from 'web3';
import { BlockTransactionString } from 'web3-eth';

export class EVMMonitor {
  web3: Web3;
  timer: NodeJS.Timer;

  lastBlockNumber: number;

  isFetching: boolean;

  constructor(provider: string) {
    this.web3 = new Web3(provider);
  }

  async getBlockNumber() {
    return await this.web3.eth.getBlockNumber();
  }

  async getBlockInfo(blockNumber: number): Promise<BlockTransactionString> {
    return await this.web3.eth.getBlock(blockNumber);
  }

  async start() {
    this.lastBlockNumber = await this.getBlockNumber();
    Logger.log(`Start fetching block info from: ${this.lastBlockNumber}`);

    this.timer = setInterval(async () => {
      if (this.isFetching) {
        return;
      }
      this.isFetching = true;
      const blockNumber = await this.getBlockNumber();
      while (this.lastBlockNumber <= blockNumber) {
        try {
          const block = await this.getBlockInfo(this.lastBlockNumber);
          Logger.log(
            `Block: ${this.lastBlockNumber} ${block.hash}, timestamp: ${block.timestamp}, tx count: ${block.transactions.length}`,
          );
          this.lastBlockNumber++;
        } catch (error) {
          Logger.error(
            `fetch block info ${this.lastBlockNumber} failed, error: ${error}, retrying......`,
          );
          await delay(300);
        }
      }
      this.isFetching = false;
    }, 1000);
  }

  async stop() {
    clearInterval(this.timer);
  }
}
