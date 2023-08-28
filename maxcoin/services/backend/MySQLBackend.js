/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const mysql = require('mysql2/promise');
const CoinAPI = require('../CoinAPI');

class MySQLBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      port: 3406,
      password: 'mypassword',
      database: 'maxcoin',
      user: 'root',
    });

    return this.connection;
  }

  async disconnect() {
    return this.connection.end();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const sql = 'INSERT INTO coinvalues(valuedate, coinvalue) VALUES ?';
    const values = [];
    data.data.entries.forEach(entry => {
      const valuedate = new Date(entry[0]);
      values.push([valuedate, entry[1]]);
    });

    return this.connection.query(sql, [values]);
  }

  async getMax() {
    return this.connection.query(
      `SELECT * FROM coinvalues ORDER by coinvalue DESC LIMIT 0, 1`
    );
  }

  async max() {
    console.info('Connection to MySQL');
    console.time('MySQL-connect');
    const connection = await this.connect();
    if (connection) {
      console.info('Succesfully connected to MySQL');
    } else {
      throw new Error('Connection to MySQL failed');
    }
    console.timeEnd('MySQL-connect');

    console.info('Inserting into MySQL');
    console.time('MySQL-insert');
    const insertResult = await this.insert();
    console.timeEnd('MySQL-insert');

    console.info(
      `Inserted ${insertResult[0].affectedRows} documents into MySQL`
    );

    console.info('Querying to MySQL');
    console.time('MySQL-find');
    const result = await this.getMax();
    const row = result[0][0];
    console.timeEnd('MySQL-find');

    console.info('Disconnection from MySQL');
    console.time('MySQL-disconnect');
    await this.disconnect();

    console.timeEnd('MySQL-disconnect');

    return row;
  }
}

module.exports = MySQLBackend;
