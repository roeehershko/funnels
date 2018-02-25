const cryptoSocket = require("crypto-socket");
const server = require('http').createServer();
const random_name = require('node-random-name');
const io = require('socket.io')(server);
cryptoSocket.start();

let lastRates = {};
io.on('connection', function(client){
    client.emit('rates', lastRates);
});

server.listen(3000);

setInterval(
    function(){
        let rates = lastRates = {
            btcusd: cryptoSocket.Exchanges['bitmex']['BTCUSD'],
            ethbtc: cryptoSocket.Exchanges['bitmex']['ETHBTC'],
            ltcbtc: cryptoSocket.Exchanges['bitmex']['LTCBTC']
        };
        io.emit('rates', rates);
    },3000);

function pushProfit() {
    let name = random_name();
    let amount = Math.round(Math.random() * 2000);
    io.emit('profit', { name: name, amount: amount });

    setTimeout(function () {
        pushProfit();
    }, Math.random() * 10000)
}
pushProfit();