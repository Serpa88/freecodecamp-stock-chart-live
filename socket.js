const io = require('socket.io')();

const Stocks = new (require('./tools/Stocks'))();

io.on('connect', function (socket) {
    // console.log("Amount connected", io.connected.length);
    // io.emit('connectionCount', io.connected.length);

    emitStocks(socket);

    socket.on('newStock', function (tickerSymbol) {
        Stocks.addStock(tickerSymbol, (err, stock) => {
            if (!err) {
                emitStocks(socket);
            }
        });
    });

    socket.on('deleteStock', function (tickerSymbol) {
        console.log('request to delete stock from graph')
        if (Stocks.removeStock(tickerSymbol)) {
            emitStocks(socket);
        }
    });
});

module.exports = io;

function emitStocks(socket) {
    io.emit('stocks', Stocks.getAllStocks());
}
