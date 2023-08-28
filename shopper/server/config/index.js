const pkg = require('../../package.json');

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: 'mongodb://localhost:37017/shopper_v1',
  },
  redis: {
    port: 7379,
    client: null,
  },
  mysql: {
    options: {
      host: 'localhost',
      port: 3406,
      database: 'shopper',
      dialect: 'mysql',
      user: 'root',
      password: 'mypassword',
    },
    client: null,
  },
};
