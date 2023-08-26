const axios = require('axios');

class CoinAPI {
  constructor() {
    // this.apiUrl = "https://api.coindesk.com/v1/bpi/historical/close.json";
    this.apiUrl = 'https://production.api.coindesk.com/v2/tb/price/values/BTC?';
    // this.apiUrl = `https://production.api.coindesk.com/v2/tb/price/values/BTC?start_date=2014-11-02T22:00&end_date=2023-08-25T20:33&ohlc=false`;
  }

  // eslint-disable-next-line class-methods-use-this
  formatDate(date) {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`.padStart(2, '0');
    let day = `${d.getDate()}`.padStart(2, '0');
    const year = `${d.getFullYear()}`;

    const hours = `${d.getHours()}`.padStart(2, '0');
    const minutes = `${d.getMinutes()}`.padStart(2, '0');

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;
    const formatedDate = `${[year, month, day].join('-')}T${hours}:${minutes}`;
    return formatedDate;
  }

  async fetch() {
    const today = new Date();
    const end = this.formatDate(today);
    const start = this.formatDate(today.setFullYear(today.getFullYear() - 5));
    // const url = `${this.apiUrl}?start=${start}&end=${end}`;
    const url = `${this.apiUrl}start_date=${start}&end_date=${end}&ohlc=false`;
    // const url = this.apiUrl;
    const response = await axios.get(url);
    return response.data;
  }
}

module.exports = CoinAPI;
