const Stock = require('./Stock.js');

class Stocks {
    constructor() {
        this.stocks = [];
    }

    addStock(code, cb) {
        let self = this;
        const stockerino = new Stock(code);
        stockerino.update(function (err, stock) {
            if (!err) {
                self.stocks.push(stockerino);
                cb(null, stock);
            }
            else {
                console.log(err.message);
                cb(err);
            }
        });
        this.stocks.push(stockerino);
    }

    /**
     * 
     * @param {String} tickerSymbol ticker symbol of stock to remove
     * @returns Boolean | Whether anything was deleted
     */
    removeStock(tickerSymbol) {
        const pLowerCase = tickerSymbol.toLowerCase();
        const stockIndex = this.stocks.findIndex(s => s.getCode().toLowerCase() === pLowerCase);
        console.log(tickerSymbol, stockIndex);
        if (stockIndex !== -1) {
            this.stocks.splice(stockIndex, 1);
            this.stocks.splice(stockIndex, 1);
            console.log(this.stocks);
            return true;
        } else return false;
    }

    getAllStocks() {
        const formattedStocks = {};
        this.stocks.forEach(stock => {
            formattedStocks[stock.getCode()] = stock.getSeries();
        });
        console.log(formattedStocks);
        return formattedStocks;
    }
};

module.exports = Stocks;