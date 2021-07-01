var _data = require('./data');
var helpers = require('./helpers');
var stripe = require('./stripe');

// Define all the handlers
var handlers = {};
/*
 * HTML Handlers
 *
 */
// Index Handler
// Index
handlers.index = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'This is the title',
            'head.description': 'This is the meta description',
            'body.title': 'Hello templated world!',
        };
        // Read in a template as a string
        helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};


// Public assets
handlers.public = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Get the filename being requested
        var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
        if (trimmedAssetName.length > 0) {
            // Read in the asset's data
            helpers.getStaticAsset(trimmedAssetName, (err, data) => {
                if (!err && data) {

                    // Determine the content type (default to plain text)
                    var contentType = 'plain';

                    if (trimmedAssetName.indexOf('.css') > -1) {
                        contentType = 'css';
                    }

                    if (trimmedAssetName.indexOf('.png') > -1) {
                        contentType = 'png';
                    }

                    if (trimmedAssetName.indexOf('.jpg') > -1) {
                        contentType = 'jpg';
                    }

                    if (trimmedAssetName.indexOf('.ico') > -1) {
                        contentType = 'favicon';
                    }

                    // Callback the data
                    callback(200, data, contentType);
                } else {
                    callback(404);
                }
            });
        } else {
            callback(404);
        }

    } else {
        callback(405);
    }
};

// Create Account
handlers.accountCreate = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Signup is easy and only takes a few seconds.',
            'body.class': 'accountCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('accountCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Create New Session
handlers.sessionCreate = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Login to your account.',
            'head.description': 'Please enter your email and password to access your account.',
            'body.class': 'sessionCreate'
        };
        // Read in a template as a string
        helpers.getTemplate('sessionCreate', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//Session has beenn deleted
handlers.sessionDeleted = function (data, callback) {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Logged Out',
            'head.description': 'You have been logged out of your account',
            'body.class': 'sessionDeleted'
        };
        // Read in a template as a string
        helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, function (err, str) {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Edit Your Account
handlers.accountEdit = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Account Settings',
            'body.class': 'accountEdit'
        };
        // Read in a template as a string
        helpers.getTemplate('accountEdit', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

// Account has been deleted
handlers.accountDeleted =  (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Account Deleted',
            'head.description': 'Your account has been deleted.',
            'body.class': 'accountDeleted'
        };
        // Read in a template as a string
        helpers.getTemplate('accountDeleted', templateData,  (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData,  (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};


// Product List
handlers.productsList = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Products List.',
            'head.description': 'List of product you can shop.',
            'body.class': 'productsList'
        };
        // Read in a template as a string
        helpers.getTemplate('productsList', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//Checkout All
handlers.checkoutPage = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Checkout.',
            'head.description': 'List of product to checkout.',
            'body.class': 'checkoutPage'
        };
        // Read in a template as a string
        helpers.getTemplate('checkoutPage', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};

//Checkout feedback. Receipt
handlers.checkoutFeedback = (data, callback) => {
    // Reject any request that isn't a GET
    if (data.method == 'get') {
        // Prepare data for interpolation
        var templateData = {
            'head.title': 'Checkout feedback.',
            'head.description': 'Order receipt.',
            'body.class': 'checkoutFeedback'
        };
        // Read in a template as a string
        helpers.getTemplate('checkoutFeedback', templateData, (err, str) => {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversalTemplates(str, templateData, (err, str) => {
                    if (!err && str) {
                        // Return that page as HTML
                        callback(200, str, 'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
    } else {
        callback(405, undefined, 'html');
    }
};


/*
 * JSON API Handlers
 *
 */

// Ping
handlers.ping = (data, callback) => {
    callback(200);
};

// Not-Found
handlers.notFound = (data, callback) => {
    callback(404);
};

// Users
handlers.users = (data, callback) => {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._users = {};

// Required data: name , adress, email, password
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var adress = typeof (data.payload.adress) == 'string' && data.payload.adress.trim().length > 0 ? data.payload.adress.trim() : false;
    var email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (name && adress && email && password) {
        // Make sure the user doesnt already exist, check by mail
        _data.read('users', email, (err, data) => {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object
                if (hashedPassword) {
                    var userObject = {
                        'name': name,
                        'adress': adress,
                        'email': email,
                        'hashedPassword': hashedPassword,
                    };

                    //Store the user
                    _data.create('users', email, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not create the new user', err });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password.' });
                }

            } else {
                //User alread exists
                callback(400, { 'Error': 'A user with that email already exists' });
            }
        });

    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }

};

// Required data: email
handlers._users.get = (data, callback) => {
    // Check that email is valid
    let email = typeof (data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 10 ? data.queryStringObject.email.trim() : false;
    if (email) {
        // Get token from headers
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the email 
        handlers._login.verifyToken(token, email, (tokenIsValid) => {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, (err, data) => {
                    if (!err && data) {
                        //Remove the hashed password from the user user object before returning it to the requester
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
            }
        });

    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};


// Required data: email
// Optional data: name, adress, password (at least one must be specified)
handlers._users.put = (data, callback) => {
    // Check for required field
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 10 ? data.payload.email.trim() : false;

    // Check for optional fields
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var adress = typeof (data.payload.adress) == 'string' && data.payload.adress.trim().length > 0 ? data.payload.adress.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if email is invalid
    if (email) {
        // Error if nothing is sent to update
        if (name || adress || password) {
            // Get token from headers
            var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

            handlers._login.verifyToken(token, email, (tokenIsValid) => {

                if (tokenIsValid) {
                    // Lookup the user
                    _data.read('users', email, (err, userData) => {
                        if (!err && userData) {
                            // Update the fields if necessary
                            if (name) {
                                userData.name = name;
                            }
                            if (adress) {
                                userData.adress = adress;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update('users', email, userData, (err) => {
                                if (!err) {
                                    callback(200, userData);
                                } else {
                                    console.log(err);
                                    callback(500, { 'Error': 'Could not update the user.' });
                                }
                            });
                        } else {
                            callback(400, { 'Error': 'Specified user does not exist.' });
                        }
                    });

                } else {
                    callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
                }
            });

        } else {
            callback(400, { 'Error': 'Missing fields to update.' });
        }
    } else {
        callback(400, { 'Error': 'Missing required field.' });
    }

};

// Required data: email
handlers._users.delete = (data, callback) => {
    // Check that email number is valid
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 10 ? data.payload.email.trim() : false;
    if (email) {
        // Get token from headers
        var token = typeof (data.payload.token) == 'string' ? data.payload.token : false;

        // Verify that the given token is valid for the email
        handlers._login.verifyToken(token, email, (tokenIsValid) => {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, (err, data) => {
                    if (!err && data) {
                        // Delete the user's data
                        _data.delete('users', email, (err) => {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(500, { 'Error': 'Could not delete the specified user' });
                            }
                        });
                    } else {
                        callback(400, { 'Error': 'Could not find the specified user.' });
                    }
                });

            } else {
                callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};


// Login
handlers.login = (data, callback) => {
    var acceptableMethods = ['post', 'get', 'delete', 'put'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._login[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._login = {};

// Required data: email, password
// Optional data: none
handlers._login.post = (data, callback) => {
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    let password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (email && password) {
        // Lookup the user who match email 
        _data.read('users', email, (err, userData) => {
            if (!err && userData) {
                // Hash the sent password, and compare it to the password stored in the user object
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.hashedPassword) {
                    // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;

                    var tokenObject = {
                        'email': email,
                        'token': tokenId,
                        'expires': expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, { 'Error': 'Could not create the new token' });
                        }
                    });
                } else {
                    callback(400, { 'Error': 'Password did not match the specified user\'s stored password' });
                }
            } else {
                callback(400, { 'Error': 'Could not find the specified user.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field(s).' })
    }
};

//Update token
handlers._login.put = (data, callback) => {

    let token = typeof (data.payload.token) == 'string' ? data.payload.token : false;

    _data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData) {

            handlers._login.verifyToken(token, tokenData.email, (tokenIsValid) => {
                if (tokenIsValid) {
                    var expires = Date.now() + 1000 * 60 * 60;

                    //Update token
                    var newTokenObject = {
                        'email': tokenData.email,
                        'token': token,
                        'expires': expires
                    };

                    _data.update('tokens', token, newTokenObject, (err) => {
                        if (!err) {
                            callback(200, { 'email': tokenData.email, 'token': token });
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not update the token.' });
                        }
                    });

                } else {
                    callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
                }
            });
        } else {
            callback(400, { 'Error': 'Could not find the user token.' });
        }

    });

}

//Get Token data
handlers._login.get = (data, callback) => {

    let email = typeof (data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 10 ? data.queryStringObject.email.trim() : false;
    let allTokensList = [];
    let expiresList = [];

    if (email) {
        _data.list('tokens', (err, listData) => {

            if (!err && listData) {

                listData.forEach(tokenId => {

                    _data.read('tokens', tokenId, (err, tokenData) => {

                        if (!err && tokenData) {

                            expiresList.push(tokenData.expires);
                            allTokensList.push(tokenData);

                            if (expiresList.length == listData.length && allTokensList.length == listData.length) {

                                //let max = expiresList.reduce(function (a, b) { return a > b ? a : b; });
                                let maxExpirationTime = () => {
                                    let numeroAnterior = 0;
                                    let numeroActual;

                                    expiresList.forEach(function (e) {
                                        numeroActual = e;

                                        if (numeroActual > numeroAnterior) {
                                            numeroAnterior = numeroActual;
                                        }

                                        if (expiresList[expiresList.length - 1] === e) {
                                            // console.log("Es este numero exp:", numeroAnterior);
                                            return numeroAnterior;
                                        }
                                    });
                                    return numeroAnterior;
                                }
                                let result = maxExpirationTime();

                                allTokensList.forEach(token => {
                                    if (token.expires == result) {
                                        callback(200, token);
                                    }
                                });
                            }
                        } else {
                            callback(404, { 'Error': 'Could not read this token.' });
                        }

                    });

                });

            } else {
                callback(404, { 'Error': 'Could not read token collection.' });
            }
        });

    } else {
        callback(400, { 'Error': 'Missing email field.' });
    }
}

// Verify if a given token id is currently valid for a given user
handlers._login.verifyToken = (token, email, callback) => {
    // Lookup the token
    _data.read('tokens', token, (err, tokenData) => {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.email == email && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Logout , destroy token
handlers.logout = (data, callback) => {
    var acceptableMethods = ['put'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._logout[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._logout = {};

handlers._logout.put = (data, callback) => {
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

    if (email) {
        var token = typeof (data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user who match email 
        _data.read('users', email, (err, userData) => {
            if (!err && userData) {

                _data.read('tokens', token, (err, tokenData) => {
                    if (!err && tokenData) {

                        tokenData.expires = false;
                        //Store the new updates in tokens
                        _data.update('tokens', token, tokenData, (err) => {
                            if (!err) {
                                callback(200);
                            } else {
                                console.log(err);
                                callback(500, { 'Error': 'Could not update the token.' });
                            }
                        });
                    } else {
                        callback(400, { 'Error': 'Could not find the user token.' });
                    }
                });
            } else {
                callback(400, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field(s).' })
    }
};

//Product
handlers.product = (data, callback) => {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._product[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._product = {};

handlers._product.get = (data, callback) => {

    let productId = (typeof data.queryStringObject.id === "string") ? data.queryStringObject.id : false;

    if (productId) {
        _data.read('products', productId, (err, productData) => {
            if (!err && productData) {
                callback(200, productData);
            }
        });

    } else {
        callback(400, { 'Error': 'Missing required product id or is not valid' })
    }
}


// Products
handlers.products = (data, callback) => {
    var acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._products[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._products = {};

// Required data: email
handlers._products.get = (data, callback) => {

    let token = typeof (data.queryStringObject.token) == 'string' ? data.queryStringObject.token : false;
    let email = typeof (data.headers.email) == 'string' && data.headers.email.trim().length > 10 ? data.headers.email.trim() : false;

    //&&
    if (email) {
        _data.read('users', email, (err, data) => {
            if (!err && data) {
                // Verify that the given token is valid
                handlers._login.verifyToken(token, email, (tokenIsValid) => {
                    if (tokenIsValid) {
                        //List all prods
                        _data.list('products', (err, data) => {
                            if (!err && data) {
                                let list = [];
                                console.log(data.length);

                                //List all prods
                                data.forEach(item => {
                                    _data.read('products', item, (err, items) => {

                                        if (!err && items) {
                                            list.push(items);
                                            if (list.length === data.length) {
                                                callback(200, list);
                                            }
                                        } else {
                                            console.log(err);
                                            callback(400)
                                        }
                                    });
                                });
                            } else {
                                callback(404, { 'Error': 'Error looking for products list' });
                            }
                        });
                    } else {
                        callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
                    }
                });
            } else {
                callback(404, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
};

//Cart
handlers.cart = (data, callback) => {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._cart = {};

handlers._cart.post = (data, callback) => {
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 10 ? data.payload.email.trim() : false;
    let token = typeof (data.payload.token) == 'string' ? data.payload.token : false;
    let productId = typeof (data.payload.productId) == 'number' ? data.payload.productId : false;

    if (email && token && productId) {
        _data.read('users', email, (err, userData) => {
            let userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];
            let cartObject = {
                'idCart': token,
                'userEmail': email,
                'productId': productId,
            };

            if (!err && userData) {
                // console.log("Quien sos: ", productId);
                //Veryfy token is valid for shopping
                handlers._login.verifyToken(token, email, (tokenIsValid) => {
                    if (tokenIsValid) {
                        _data.read('products', productId, (err, productData) => {
                            if (!err && productData) {
                                // Probar en vez de read list cart
                                _data.read('cart', token, (err, cartData) => {
                                    if (!err && cartData) {
                                        //If no err cart already exist.
                                        if (cartData.length > 1) {
                                            let jsonArray = [];

                                            cartData.forEach((prods) => {
                                                jsonArray.push(prods);
                                            });
                                            jsonArray.push(cartObject);

                                            if (jsonArray.length === cartData.length + 1) {
                                                _data.update('cart', token, jsonArray, (err) => {
                                                    if (!err) {
                                                        console.log("ITEM AGREGADO");
                                                        callback(200);
                                                    } else {
                                                        callback(400, { "Error": "Error adding product. Could not update cart." });
                                                    }
                                                });
                                            }
                                        } else {
                                            //If cart has only 1 item it an obj, turn to array and add other
                                            let cart = [];
                                            cart.push(cartData, cartObject)
                                            _data.update('cart', token, cart, (err) => {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(400, { "Error": "Could not update cart.", productId });
                                                }
                                            });
                                        }
                                    }
                                    if (err) {
                                        // console.log("Quien sos2:", productId);
                                        //If error mean no cart in dir
                                        //Create new cart
                                        _data.create("cart", token, cartObject, (err) => {
                                            //Si se crea ok devuelve FALSE
                                            if (!err) {
                                                //Add cart to user object
                                                userData.cart = userCart;
                                                userData.cart.push({ "id": token, createTime: Date(), "checkout": false });
                                                //Update user 
                                                _data.update('users', email, userData, (err) => {
                                                    if (!err) {
                                                        callback(200);
                                                    } else {
                                                        callback(500, { 'Error': 'Could not update the user with the new check.' });
                                                    }
                                                });
                                            } else {
                                                _data.read('cart', token, (err, cartData) => {
                                                    if (cartData.length > 1) {
                                                        let jsonArray = [];

                                                        cartData.forEach((prods) => {
                                                            jsonArray.push(prods);
                                                        });
                                                        jsonArray.push(cartObject);

                                                        if (jsonArray.length === cartData.length + 1) {
                                                            _data.update('cart', token, jsonArray, (err) => {
                                                                if (!err) {
                                                                    console.log("ITEM AGREGADO");
                                                                    callback(200);
                                                                } else {
                                                                    callback(400, { "Error": "Error adding product. Could not update cart." });
                                                                }
                                                            });
                                                        }
                                                    } else {
                                                        //If cart has only 1 item it an obj, turn to array and add other
                                                        let cart = [];
                                                        cart.push(cartData, cartObject)
                                                        _data.update('cart', token, cart, (err) => {
                                                            if (!err) {
                                                                callback(200);
                                                            } else {
                                                                callback(400, { "Error": "Could not update cart.", productId });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else {
                                callback(404, { 'Error': 'Specified product does not exist.' });
                            }
                        });
                    } else {
                        callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
                    }
                });
            } else {
                callback(404, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};


//Checkout
handlers.checkout = (data, callback) => {
    var acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checkout[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._checkout = {};

handlers._checkout.post = (data, callback) => {
    //Check ser
    let email = typeof (data.payload.email) == 'string' && data.payload.email.trim().length > 10 ? data.payload.email.trim() : false;
    //Get token from headers
    let token = typeof (data.payload.token) == 'string' ? data.payload.token : false;

    if (email) {
        //Check user mail exists in db
        _data.read('users', email, (err, userData) => {

            if (!err && data) {
                //Veryfy token is valid for shopping
                handlers._login.verifyToken(token, email, (tokenIsValid) => {
                    if (tokenIsValid) {
                        var userCart = typeof (userData.cart) == 'object' && userData.cart instanceof Array ? userData.cart : [];

                        if (userData.cart.length > 0) {
                            //Chose cart id that match token
                            let cartId;
                            userCart.forEach((e) => {

                                if (e.id === token) {
                                    // console.log(e);
                                    cartId = e.id;
                                }
                            });

                            if (cartId === token) {
                                let listProducts = [];

                                _data.read('cart', cartId, (err, cartData) => {
                                    //Necesito los id de todos los productos comprados
                                    cartData.forEach((prod) => {
                                        listProducts.push(prod.productId);
                                    });

                                    //Una vez que el largo del cart(cartData) es igual listProducts
                                    //Buscar en products los precios de todos los productos comprados
                                    if (cartData.length === listProducts.length) {
                                        let listProdsPrices = [];
                                        let totalAmoutPrice = 0;

                                        listProducts.forEach((pid) => {

                                            _data.read('products', pid, (err, prod) => {
                                                listProdsPrices.push(prod.price);
                                                totalAmoutPrice += prod.price;

                                                if (cartData.length === listProdsPrices.length) {
                                                    //Llamar a helpers Stripe 
                                                    stripe.getStripeToken(token, email, totalAmoutPrice,
                                                        (result) => {
                                                            if (result.receipt_url.length > 1) {
                                                                callback(200, result);
                                                            }
                                                        }
                                                    );
                                                }
                                            });
                                        });
                                    }
                                });
                            } else {
                                callback(403, { "Error": "Cart token is invalid, can t checkout. Purchase new products to create a new order" });
                            }
                        } else {
                            callback(403, { "Error": "There cart is empty. Add some products to your cart then you can checkout" });
                        }
                    } else {
                        callback(403, { "Error": "Missing required token in header, or token is invalid. If token invalid, please login" });
                    }
                });
            } else {
                callback(404, { 'Error': 'Specified user does not exist.' });
            }
        });
    } else {
        callback(400, { 'Error': 'Missing email, please complete field' })
    }
};


//Export the handlers
module.exports = handlers;