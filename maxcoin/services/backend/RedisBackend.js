/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const Redis = require('ioredis');
const CoinAPI = require('../CoinAPI');

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  connect() {
    this.client = new Redis(7379);
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    // if (!this.client) throw new Error('Redis is not connected');
    const data = await this.coinAPI.fetch();
    const values = [];
    data.data.entries.forEach(entry => {
      values.push(entry[1]);
      values.push(entry[0]);
    });
    return this.client.zadd('maxcoin:values', values);
  }

  async getMax() {
    return this.client.zrange('maxcoin:values', -1, -1, 'WITHSCORES');
  }

  async max() {
    console.info('Connection to Redis');
    console.time('Redis-connect');
    const client = this.connect();
    if (client) {
      console.info('Succesfully connected to Redis');
    } else {
      throw new Error('Connection to Redis failed');
    }
    console.timeEnd('Redis-connect');

    console.info('Inserting into Redis');
    console.time('Redis-insert');
    const insertResult = await this.insert();
    console.timeEnd('Redis-insert');

    console.info(`Inserted ${insertResult} documents into Redis`);

    console.info('Querying to Redis');
    console.time('Redis-find');
    const result = await this.getMax();
    console.timeEnd('Redis-find');

    console.info('Disconnection from Redis');
    console.time('Redis-disconnect');
    await this.disconnect();

    console.timeEnd('Redis-disconnect');

    return result;
  }
}

module.exports = RedisBackend;
