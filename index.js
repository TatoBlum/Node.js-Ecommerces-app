const http = require('http');
const https = require('https');
const fs = require('fs');

const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Instantiate the server module object
let server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

// Start the HTTP server
server.httpServer.listen(3000, () => {
    console.log('\x1b[36m%s\x1b[0m', 'The HTTP server is running on port ' + '3000');
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

// Start the HTTPS server
server.httpsServer.listen(3001, function () {
    console.log('\x1b[35m%s\x1b[0m', 'The HTTPS server is running on port ' + "3001");
});

// Instantiate the HTTPS server
// server.httpsServerOptions = {
//     'key': fs.readFileSync(path.join(__dirname, '/./https/key.pem')),
//     'cert': fs.readFileSync(path.join(__dirname, '/./https/cert.pem'))
// };

// server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
//     server.unifiedServer(req, res);
// });

server.unifiedServer = (req, res) => {

    let parseUrl = url.parse(req.url, true);

    let path = parseUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    let queryStringObject = parseUrl.query;

    let method = req.method.toLowerCase();

    let headers = req.headers;

    let decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        let chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data, (statusCode, payload, contentType) => {

            // Determine the type of response (fallback to JSON)
            contentType = typeof (contentType) == 'string' ? contentType : 'json';

            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Return the response parts that are content-type specific
            let payloadString = '';

            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                payload = typeof (payload) == 'object' ? payload : {};
                payloadString = JSON.stringify(payload);
            }

            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof (payload) == 'string' ? payload : '';
            }

            if (contentType == 'css') {
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType == 'plain') {
                res.setHeader('Content-Type', 'text/plain');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType == 'favicon') {
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType == 'png') {
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }

            if (contentType == 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof (payload) !== 'undefined' ? payload : '';
            }


            res.writeHead(statusCode);
            res.end(payloadString);

            if (contentType === "json")
                console.log("Returning this response: ", statusCode, payloadString, contentType);
            else console.log("Returning this response: ", statusCode, contentType);

        });
    });

};

server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create': handlers.sessionCreate,
    'session/deleted': handlers.sessionDeleted,
    'products/all': handlers.productsList,
    'checkout/all': handlers.checkoutPage,
    'checkout/feedback': handlers.checkoutFeedback,
    
    'checks/create': handlers.checksCreate, //Editar
    'checks/edit': handlers.checksEdit, //Editar
    
    'ping': handlers.ping,
    'public': handlers.public,

    'api/users': handlers.users,
    'api/login': handlers.login,
    'api/logout': handlers.logout,
    'api/products': handlers.products,
    'api/product': handlers.product,
    'api/cart': handlers.cart,
    'api/checkout': handlers.checkout
};



