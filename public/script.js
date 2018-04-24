var seriesOptions = [],
    seriesCounter = 0,
    names = [
        'MSFT', 'AAPL', 'GOOG'
    ],
    socket = io();
/**
* Create the chart when all data is loaded
* @returns {undefined}
*/
function createChart() {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0
                        ? ' + '
                        : '') + this.value + '%';
                }
            },
            plotLines: [
                {
                    value: 0,
                    width: 2,
                    color: 'silver'
                }
            ]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({poin' +
                    't.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}

socket
    .on('stocks', function (stocks) {
        seriesOptions = [];
        htmlString = '<div class="row">\n';
        Object
            .entries(stocks)
            .forEach((stock, index) => {
                seriesOptions.push({name: stock[0], data: stock[1]});

                htmlString += `<div class="col">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">
                    ${stock[0].toUpperCase()}
                    <button class="close" data-symbol="${stock[0].toLowerCase()}" class="btn btn-link float-right" type="button">
                        <img src="close.png" class="float-right" height="20px" width="20px">
                    </button>
                </h5>
            </div>
        </div>
    </div>`;
                if (index % 4 === 0 && index !== 0) {
                    htmlString += `</div>
                <div class="row">
                `;
                }
            });
        htmlString += `<div class="col">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Add another stock to the chart!</h5>
            <!-- <p class="card-text">With supporting text below as a natural lead-in to additional content.</p> -->
            <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
            <form id="stockAdder">
                <div class="input-group mb-3">
                    <input id="ticker-symbol" type="text" class="form-control" placeholder="Ticker Symbol" aria-label="Ticker symbol input">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="submit">Add</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
    </div>`;
        document
            .getElementById('main')
            .innerHTML = htmlString;
        document
            .getElementById('stockAdder')
            .addEventListener('submit', function (e) {
                e.preventDefault();
                const tickerSymbol = document
                    .querySelector('#ticker-symbol')
                    .value;
                socket.emit('newStock', tickerSymbol);
            });
        const closeButtonForStock = document.querySelectorAll('.close');
        //Remove stock from website
        if (closeButtonForStock) {
            closeButtonForStock.forEach(e => {
                e
                    .addEventListener('click', function (event) {
                        const tickerSymbol = event
                            .currentTarget
                            .attributes[1]
                            .value;
                            console.log(tickerSymbol);
                        socket.emit('deleteStock', tickerSymbol);
                    });
            });
        }
        createChart();
    });

// $.each(names, function (i, name) {     const lName = name.toLowerCase();
// seriesOptions[i] = {         name: name,         data: stocks[lName]     };
// // As we're loading the data asynchronously, we don't know what order it will
//     // arrive. So we keep a counter and create the chart when all the data
// is     // loaded.     seriesCounter += 1;     if (seriesCounter ===
// names.length) {         createChart();     } });