var fetch = require('node-fetch');
/**
 * Fetches and processes individual stock information
 */
class Stock {
    /**
     *
     * @param {String} stockCode The ticker symbol for the stock
     */
    constructor(stockCode) {
        this.stockCode = stockCode;
    }

    update(cb) {
        fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.stockCode}&outputsize=compact&apikey=` + process.env.ALPHA_VANTAGE_API_KEY).then(res => res.json(), err => cb(err)).then(body => {
            if (Object.keys(body)[0].search(/error/i) !== -1) 
                throw new Error(Object.entries(body)[0][1]);
            return this.mapData(body['Time Series (Daily)']);
        }).then(series => {
            this.series = series;
            cb(null, this);
        }).catch(err => cb(err));
    }

    mapData(rawTimeSeries) {

        const series = [];
        Object
            .entries(rawTimeSeries)
            .forEach(day => {
                series.push([
                    Date.parse(day[0]),
                    parseFloat(day[1]['4. close'])
                ]);
            });
        series.reverse();
        return series;
    }

    getSeries() {
        return this.series;
    }

    getCode() {
        return this.stockCode;
    }
}

module.exports = Stock;