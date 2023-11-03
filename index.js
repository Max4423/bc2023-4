const http = require('http');
const fs = require('fs');
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

const server = http.createServer((req, res) => {
    fs.readFile('data.xml', 'utf8', (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        const xmlParser = new XMLParser();
        const parsedData = xmlParser.parse(data); //обробкa XML-даних, які були прочитані з файлу 

        let maxRate = 0;
        parsedData.exchange.currency.forEach(currency => {
            if (parseFloat(currency.rate) > maxRate) {
                maxRate = parseFloat(currency.rate);
            }
        });

        const xmlBuilder = new XMLBuilder();
        const xmlResponse = xmlBuilder.build({ data: { max_rate: maxRate.toString() } });

        res.writeHead(200, { 'Content-Type': 'application/xml' }); //встановлюють HTTP-статус відповіді (200-"OK")
        res.write(xmlResponse);
        res.end();
    });
});

const host = "localhost";
const port = 3000;
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
