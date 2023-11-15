const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');

const server = http.createServer((req, res) => {
    fs.readFile('data.xml', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const xmlParser = new XMLParser();
        const parsedData = xmlParser.parse(data);

        // Check if 'currency' is an array; if not, convert it to an array
        const currencies = Array.isArray(parsedData.exchange.currency)
            ? parsedData.exchange.currency
            : [parsedData.exchange.currency];

        let maxRate = 0;

        currencies.forEach(currency => {
            const currentRate = parseFloat(currency.rate);
            if (!isNaN(currentRate) && currentRate > maxRate) {
                maxRate = currentRate;
            }
        });

        const xmlBuilder = new XMLBuilder();
        const xmlResponse = xmlBuilder.build({ data: { max_rate: maxRate.toString() } });

        res.writeHead(200, { 'Content-Type': 'application/xml' });
        res.end(xmlResponse);
    });
});

const host = 'localhost';
const port = 8000;
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
