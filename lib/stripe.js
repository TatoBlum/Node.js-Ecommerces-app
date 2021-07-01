const querystring = require('querystring');
const https = require('https');
const StringDecoder = require('string_decoder').StringDecoder;
const helpers = require('./helpers');
const _data = require('./data');
var fs = require('fs');


// Container for all stripe api calls
let stripe = {};

stripe.getStripeToken = (token, email, amount, callback) => {

    var requestDetails = {
        'method': 'POST',
        'hostname': 'api.stripe.com',
        'path': '/v1/tokens',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer sk_test_51J3omiAxcyOUVEGkD8ujH3PisnLF4kT2fpSmIi0QkXk8ja1usKc31j5g850B1nCfqcDp9jzyddBOfFXZa3dbt3G600cIrqjFEg'
        },
        'maxRedirects': 20
    };

    // Configure the request payload
    var payload = {
        'card[number]': '4242424242424242',
        'card[exp_month]': '6',
        'card[exp_year]': '2022',
        'card[cvc]': '314'
    };

    var stringPayload = querystring.stringify(payload);

    // Instantiate the request object
    var req = https.request(requestDetails, (res) => {
        // Grab the status of the sent request
        var status = res.statusCode;
        var body = '';
        let decoder = new StringDecoder('utf-8');


        res.on('data', (chunk) => {
            body += decoder.write(chunk);
            //console.log('BODY: ' + chunk);
            if (body.length > 0) {

                var result = helpers.parseJsonToObject(body);

                // Callback successfully if the request went through
                if (status == 200) {
                    stripe.checkoutStripe(token, email, amount, result.id, (res) => {
                        callback(res);
                    });
                }
            } else {
                callback(status)
            }

        });



    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', function (e) {
        callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

};



stripe.checkoutStripe = (userToken, email, amount, tokenId, callback) => {

    var requestDetails = {
        'method': 'POST',
        'hostname': 'api.stripe.com',
        'path': '/v1/charges',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer sk_test_51J3omiAxcyOUVEGkD8ujH3PisnLF4kT2fpSmIi0QkXk8ja1usKc31j5g850B1nCfqcDp9jzyddBOfFXZa3dbt3G600cIrqjFEg'
        },
        'maxRedirects': 20
    };

    // Configure the request payload

    var payload = {
        'amount': amount,
        'currency': 'CHF',
        'description': 'Charge for Shopping of CHF pour 0.60',
        'source': tokenId
    };

    var stringPayload = querystring.stringify(payload);

    // Instantiate the request object
    var req = https.request(requestDetails, (res) => {
        // Grab the status of the sent request
        var status = res.statusCode;
        var body = '';
        let decoder = new StringDecoder('utf-8');
        let mailResponse = {}; 


        res.on('data', (chunk) => {
            body += decoder.write(chunk);
            //console.log('BODY: ' + chunk);
            if (body.length > 0) {
                var result = helpers.parseJsonToObject(body);
                // Callback successfully if the request went through
                if (status == 200) {
                    //Agregar en usuario en cart compra exitosa

                    _checkCart(userToken, email);

                    //Mandar notificacion por mail
                    stripe.sendMailgun(result.receipt_url, (mailgun)=> {                        
                        callback({ "receipt_url": result.receipt_url, mailgun});
                    });
                    
                } else {
                    callback({ "Error": "Something went wrong, status code: " + status });
                }
            }
        });
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', function (e) {
        callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
}


stripe.sendMailgun = (urlReceipt, callback) => {

    var requestDetails = {
        'method': 'POST',
        'hostname': 'api.mailgun.net',
        'path': '/v3/sandboxfb9b6d814b924f3ca4b46354a0ec8afb.mailgun.org/messages',
        'headers': {
            'Authorization': 'Basic YXBpOjdlMWM1OGYwNmJkNWYwMWIxMmUzOWMwOGMyM2Y5ZDU0LTFmMWJkNmE5LTJkM2Y2YjY0',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        'maxRedirects': 20
    };

    var payload = {
        'from': 'ozzmab@hotmail.com',
        'to': 'ozzmab@hotmail.com',
        'subject': 'Stripe Receipt',
        'text': 'This is you receipt: '+urlReceipt
    };

    var stringPayload = querystring.stringify(payload);

    var req = https.request(requestDetails, function (res) {

        var status = res.statusCode;
        var body = '';
        let decoder = new StringDecoder('utf-8');

        res.on("data", (chunk) => {
            body += decoder.write(chunk);

            //console.log('BODY: ' + chunk);
            if (body.length > 0) {
                var result = helpers.parseJsonToObject(body);
                // Callback successfully if the request went through
                if (status == 200) {
                    callback({"status":status,result});
                } else {
                    console.log({ "Error": "Something went wrong, status code: " + status });
                }
            }

        });


    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', function (e) {
        callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();


}


function _checkCart(userToken, email) {

    let newCart = {};
    let newCartId = helpers.createRandomString(10);

    _data.read('users', email, (err, userData) => {

        userData.cart.forEach((cart, index, array) => {
            if (cart.id === userToken) {
                cart["checkout"] = true;
                cart["id"] = newCartId;
                cart["createTime"] = Date();
                newCart = cart;
                array.splice(index, 1);
                userData.cart.push(newCart);

                _data.rename('cart', userToken, newCartId, (err) => {
                    if (err) {
                        console.log('Fail to rename fiel', err);
                    }
                    console.log('File Renamed.');
                });

                _data.update('users', email, userData, (err) => {
                    if (!err) {
                        console.log(userData);
                    } else {
                        console.log({ 'Error': 'Could not update the user with the new cart.' });
                    }
                });
            }
        });


    });

}

// Export the module
module.exports = stripe;