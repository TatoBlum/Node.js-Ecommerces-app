/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {};

// Config
app.config = {
    'sessionToken': false,
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = function (headers, path, method, queryStringObject, payload, callback) {

    // Set defaults
    headers = typeof (headers) == 'object' && headers !== null ? headers : {};
    path = typeof (path) == 'string' ? path : '/';
    method = typeof (method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
    queryStringObject = typeof (queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof (payload) == 'object' && payload !== null ? payload : {};
    callback = typeof (callback) == 'function' ? callback : false;

    // For each query string parameter sent, add it to the path
    var requestUrl = path + '?';
    var counter = 0;
    for (var queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            counter++;
            // If at least one query string parameter has already been added, preprend new ones with an ampersand
            if (counter > 1) {
                requestUrl += '&';
            }
            // Add the key and value
            requestUrl += queryKey + '=' + queryStringObject[queryKey];
        }
    }

    // Form the http request as a JSON type
    var xhr = new XMLHttpRequest();
    xhr.open(method, requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/json");

    // For each header sent, add it to the request
    for (var headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhr.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    // If there is a current session token set, add that as a header
    if (app.config.sessionToken) {
        xhr.setRequestHeader("token", app.config.sessionToken.token);
    }

    // When the request comes back, handle the response
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var statusCode = xhr.status;
            var responseReturned = xhr.responseText;

            // Callback if requested
            if (callback) {
                try {
                    var parsedResponse = JSON.parse(responseReturned);
                    callback(statusCode, parsedResponse);
                } catch (e) {
                    console.log(e);
                    callback(statusCode, false);
                }
            }
        }
    }

    // Send the payload as JSON
    var payloadString = JSON.stringify(payload);
    xhr.send(payloadString);

};

// Bind the forms allows process more than one form at a time
app.bindForms = function () {
    if (document.querySelector("form")) {

        var allForms = document.querySelectorAll("form");
        for (var i = 0; i < allForms.length; i++) {
            allForms[i].addEventListener("submit", function (e) {

                // Stop it from submitting
                e.preventDefault();
                var formId = this.id;
                var path = this.action;
                var method = this.method.toUpperCase();

                // Hide the error message (if it's currently shown due to a previous error)
                document.querySelector("#" + formId + " .formError").style.display = 'none';

                // Hide the success message (if it's currently shown due to a previous error)
                if (document.querySelector("#" + formId + " .formSuccess")) {
                    document.querySelector("#" + formId + " .formSuccess").style.display = 'none';
                }


                // Turn the inputs into a payload
                var payload = {};
                var elements = this.elements;
                for (var i = 0; i < elements.length; i++) {
                    if (elements[i].type !== 'submit') {
                        var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
                        if (elements[i].name == '_method') {
                            method = valueOfElement;
                        } else {
                            payload[elements[i].name] = valueOfElement;
                        }
                    }
                }

                //Delete form in account settings
                if (method === "DELETE" && formId === "accountEdit3") {
                    payload = {
                        'email': app.config.sessionToken.email,
                        'token': app.config.sessionToken.token
                    }
                }

                // Call the API
                app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
                    // Display an error on the form if needed
                    if (statusCode !== 200) {

                        if (statusCode == 403) {
                            // log the user out
                            app.logUserOut();

                        } else {

                            // Try to get the error from the api, or set a default error message
                            var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

                            // Set the formError field with the error text
                            document.querySelector("#" + formId + " .formError").innerHTML = error;

                            // Show (unhide) the form error field on the form
                            document.querySelector("#" + formId + " .formError").style.display = 'block';
                        }
                    } else {
                        // If successful, send to form response processor
                        app.formResponseProcessor(formId, payload, responsePayload);
                    }

                });
            });
        }
    }
};
// app.bindForms = () => {
//     if (document.querySelector("form")) {

//         document.querySelector("form").addEventListener("submit", function (e) {
//             // Stop it from submitting
//             e.preventDefault();
//             var formId = this.id;
//             var path = this.action;
//             var method = this.method.toLocaleUpperCase();

//             // Hide the error message (if it's currently shown due to a previous error)
//             document.querySelector("#" + formId + " .formError").style.display = 'hidden';

//             // Turn the inputs into a payload
//             var payload = {};
//             var elements = this.elements;
//             for (var i = 0; i < elements.length; i++) {
//                 if (elements[i].type !== 'submit') {
//                     var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value;
//                     payload[elements[i].name] = valueOfElement;
//                 }
//                 // console.log(payload);
//             }

//             // Call the API
//             app.client.request(undefined, path, method, undefined, payload, function (statusCode, responsePayload) {
//                 // Display an error on the form if needed
//                 if (statusCode !== 200) {

//                     // Try to get the error from the api, or set a default error message
//                     var error = typeof (responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';

//                     // Set the formError field with the error text
//                     document.querySelector("#" + formId + " .formError").innerHTML = error;

//                     // Show (unhide) the form error field on the form
//                     document.querySelector("#" + formId + " .formError").style.display = 'block';

//                 } else {
//                     // If successful, send to form response processor
//                     app.formResponseProcessor(formId, payload, responsePayload);
//                 }

//             });
//         });
//     }
// };

// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
    // var functionToCall = false;
    // If account creation was successful, try to immediately log the user in
    if (formId == 'accountCreate') {
        // Take the email and password, and use it to log the user in
        var newPayload = {
            'email': requestPayload.email,
            'password': requestPayload.password
        };

        app.client.request(undefined, 'api/login', 'POST', undefined, newPayload, function (newStatusCode, newResponsePayload) {
            // Display an error on the form if needed
            if (newStatusCode !== 200) {
                // Set the formError field with the error text
                document.querySelector("#" + formId + " .formError").innerHTML = 'Sorry, an error has occured. Please try again.';
                // Show (unhide) the form error field on the form
                document.querySelector("#" + formId + " .formError").style.display = 'block';
            } else {
                // If successful, set the token and redirect the user
                app.setSessionToken(newResponsePayload);
                window.location = '/products/all';
            }
        });
    }
    // If login was successful, set the token in localstorage and redirect the user
    if (formId == 'sessionCreate') {
        app.setSessionToken(responsePayload);
        window.location = '/products/all';
    }

    // If forms saved successfully and they have success messages, show them
    var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
    if (formsWithSuccessMessages.indexOf(formId) > -1) {
        document.querySelector("#" + formId + " .formSuccess").style.display = 'block';
    }

    // If the user just deleted their account, redirect them to the account-delete page
    if (formId == 'accountEdit3') {
        app.logUserOut(false);
        window.location = '/account/deleted';
    }
};

app.cart = [];

// Get products
app.getProducts = () => {
    if (document.body.classList.contains('productsList')) {
        let productsContainer = document.getElementById("productsList-container");

        if (app.config.sessionToken) {
            let currentSessionToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
            let { email, token } = currentSessionToken;

            app.client.request({ 'email': email }, 'api/products', 'GET', { 'token': token }, undefined, (statusCode, responsePayload) => {

                let resultHtml = '';
                responsePayload.forEach((element) => {
                    let productImg = element.img;
                    let productName = element.pname;
                    let productId = element.pid;
                    let productPrice = element.price;

                    resultHtml +=
                        `<div class="itemflex">
                        <div>
                            <img src="${productImg}" class="gifImg" alt="${productName}" id="gifs">
                            <button id="buy-btn" type="button" value="${productId}" class="buy-button btn-sugerencias boton-azul boton-ver-mas">
                                Agregar
                            </button>     
                        </div>
                        <h2 class="">${productName}</h2> 
                        <h4 class="">Price $${productPrice}</h2>                     
                    </div>`
                });

                productsContainer.innerHTML = resultHtml;

                let addBtn = document.querySelectorAll('.buy-button');

                app.addItemToCart(addBtn);
            });
        } else {
            //ALERT
            console.log("Theres is no user loggin");
        }
    }
}

app.addItemToCart = (addBtn) => {
    if (document.body.classList.contains('productsList')) {

        if (addBtn.length > 0) {
            let counter = document.querySelector(".round-counter");

            addBtn.forEach(element => {
                element.addEventListener('click', function (e) {
                    e.preventDefault();

                    app.cart.push(e.target.value);

                    localStorage.setItem("cart", JSON.stringify(app.cart));

                    let retrievedObject = JSON.parse(localStorage.getItem('cart'));

                    counter.innerHTML = retrievedObject.length;
                });
            });
        }
    }
}

app.counter = () => {
    try {
        let counter = document.querySelector(".round-counter");

        let retrievedObject = JSON.parse(localStorage.getItem('cart'));

        if (retrievedObject !== null) {
            app.cart = retrievedObject;
            counter.innerHTML = retrievedObject.length;
        }
    } catch (e) {
        console.log(e);
    }
}

app.listToCheckout = () => {

    if (document.body.classList.contains('checkoutPage')) {

        let retrievedObject = JSON.parse(localStorage.getItem('cart'));
        let checkoutItemList = document.querySelector(".checkout-list");
        let array = [];

        if (retrievedObject != null) {
            retrievedObject.forEach(e => {

                let queryStringObject = {
                    'id': e
                }

                app.client.request(undefined, 'api/product', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {

                    if (statusCode === 200) {
                        let resultHtml = '';

                        array.push(responsePayload);

                        if (array.length == app.cart.length) {

                            array.forEach(element => {

                                let productImg = element.img;
                                let productName = element.pname;
                                let productId = element.pid;
                                let productPrice = element.price;

                                resultHtml +=
                                    ` <div class="cart-items" key=${productId}>
                                        <img class="cart-item-img" src=${productImg} alt=${productName} />
                                        <li class="cart-item-li"> ${productName}  Price $${productPrice}</li>
                                        <button value="${productId}" class="trash-btn remove-btn"><i class="fas fa-trash">Remove from cart</i></button>
                                    </div>`
                            });
                        }
                        checkoutItemList.innerHTML = resultHtml;
                        let removeBtns = document.querySelectorAll(".remove-btn");
                        app.removeItemFromCart(removeBtns);
                    }
                });
            });
        }
    }
}

app.removeItemFromCart = (removeBtns) => {
    if (document.body.classList.contains('checkoutPage')) {
        let counter = document.querySelector(".round-counter");
        let retrievedObject = JSON.parse(localStorage.getItem('cart'));

        if (retrievedObject != null) {

            if (removeBtns.length > 0) {

                removeBtns.forEach(element => {
                    element.addEventListener('click', (e) => {
                        e.preventDefault();

                        let index = app.cart.indexOf(e.target.value);
                        app.cart.splice(index, 1);

                        localStorage.setItem("cart", JSON.stringify(app.cart));

                        let retrievedObject = JSON.parse(localStorage.getItem('cart'));

                        counter.innerHTML = retrievedObject.length;

                        if (app.cart.length == 0) {
                            localStorage.removeItem('cart');
                        }

                        window.location.reload();
                    });
                });
            }
        }
    }
}

// app.receipt = false;

app.checkoutOrder = () => {
    if (document.body.classList.contains('checkoutPage')) {
        let retrievedObject = JSON.parse(localStorage.getItem('cart'));
        let counter = 0;

        if (app.config.sessionToken) {
            if (retrievedObject != null) {

                let checkoutBtn = document.querySelector(".checkout-btn-container");
                checkoutBtn.style.display = "flex";

                checkoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();

                    //Create cart with all items in it
                    retrievedObject.forEach((e) => {
                        let parseId = parseInt(e);

                        let body = {
                            'email': app.config.sessionToken.email,
                            'token': app.config.sessionToken.token,
                            'productId': parseId
                        }

                        app.client.request(undefined, 'api/cart', 'POST', undefined, body, (statusCode, responsePayload) => {

                            if (statusCode === 200) {
                                // console.log(statusCode, responsePayload, body);
                                counter++;
                                // console.log(counter);

                                if (counter === retrievedObject.length) {
                                    let loader = document.querySelector(".loader-container");
                                    loader.style.display = "flex";
                                    let payload = {
                                        "email": app.config.sessionToken.email,
                                        "token": app.config.sessionToken.token
                                    }
                                    app.client.request(undefined, 'api/checkout', 'POST', undefined, payload, (statusCode, responsePayload) => {
                                        loader.style.display = "none";
                                        if (statusCode === 200) {
                                            //Navegar a pagina de feedback de check out 
                                            localStorage.setItem('receipt', responsePayload.receipt_url);
                                            localStorage.removeItem('cart');

                                            window.location = 'checkout/feedback';
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            }
        } else {
            document.querySelector(".checkout-btn-container").style.display = "none";
            console.log("Loggin to checkout");
        }
    }

}

app.checkoutFeedback = () => {
    //Limpiar local storage
    if (document.body.classList.contains('checkoutFeedback')) {
        let receipt = localStorage.getItem('receipt');
        if (typeof receipt === "string") {
            let url_receipt = document.getElementById("url-receipt");
            url_receipt.innerHTML += `
              <h4>This is your stripe receipt</h4><br>
             <p><a target="_blank" href="${receipt}">Stripe link</a></p><br><br><br>
             <p>This recepit has been sent to your email account.</p>
            `
        }
    }
}

// Bind the logout button
app.bindLogoutButton = function () {
    document.getElementById("logoutButton").addEventListener("click", function (e) {

        // Stop it from redirecting anywhere
        e.preventDefault();

        // Log the user out
        app.logUserOut();

    });
};

// Log the user out then redirect them
app.logUserOut = function () {
    // Get the current token id
    var tokenId = typeof (app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;

    // Send the current token to the tokens endpoint to delete it
    var queryStringObject = {
        'id': tokenId
    };
    app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function (statusCode, responsePayload) {
        // Set the app.config token as false
        app.setSessionToken(false);

        // Send the user to the logged out page
        window.location = '/session/deleted';

    });
};


// Set the session token in the app.config object as well as localstorage
app.setSessionToken = (token) => {
    app.config.sessionToken = token;
    let tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
    if (typeof (token) == 'object') {
        app.setLoggedInClass(true);
    } else {
        app.setLoggedInClass(false);
    }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function (add) {
    var target = document.querySelector("body");
    if (add) {
        target.classList.add('loggedIn');
    } else {
        target.classList.remove('loggedIn');
    }
};

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = () => {
    let tokenString = localStorage.getItem('token');
    if (typeof (tokenString) == 'string') {
        try {
            let token = JSON.parse(tokenString);
            app.config.sessionToken = token;
            if (typeof (token) == 'object') {
                app.setLoggedInClass(true);
            } else {
                app.setLoggedInClass(false);
            }
        } catch (e) {
            app.config.sessionToken = false;
            app.setLoggedInClass(false);
        }
    }
};

// Renew the token
app.renewToken = (callback) => {
    var currentToken = typeof (app.config.sessionToken) == 'object' ? app.config.sessionToken : false;

    if (currentToken) {
        let payload = {
            "token": currentToken.token
        }

        app.client.request(undefined, 'api/login', 'PUT', undefined, payload, (statusCode, responsePayload) => {
            if (statusCode == 200) {
                var queryStringObject = { 'email': responsePayload.email };

                app.client.request(undefined, 'api/login', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {

                    console.log("statusCode", statusCode);

                    if (statusCode == 200) {
                        app.setSessionToken(responsePayload);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        app.setSessionToken(false);
        callback(true);
    }
};


// Loop to renew token often
app.tokenRenewalLoop = function () {
    setInterval(function () {
        app.renewToken(function (err) {
            if (!err) {
                console.log("Token renewed successfully @ " + Date.now());
            } else {
                console.log(err);
            }
        });
    }, 1000 * 60);
};

// Load data on the page
app.loadDataOnPage = function () {
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof (bodyClasses[0]) == 'string' ? bodyClasses[0] : false;

    // Logic for account settings page
    if (primaryClass == 'accountEdit') {
        app.loadAccountEditPage();
    }
};

// Load the account edit page specifically
app.loadAccountEditPage = function () {
    // Get the email from the current token, or log the user out if none is there
    var email = typeof (app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;

    if (email) {
        // Fetch the user data
        var queryStringObject = {
            'email': email
        };
        app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function (statusCode, responsePayload) {
            if (statusCode == 200) {
                // Put the data into the forms as values where needed
                document.querySelector("#accountEdit1 .nameInput").value = responsePayload.name;
                document.querySelector("#accountEdit1 .adressInput").value = responsePayload.adress;
                document.querySelector("#accountEdit1 .displayEmailInput").value = responsePayload.email;

                //Put the hidden email field into both forms
                var hiddenEmailInputs = document.querySelectorAll("input.hiddenEmailInput");
                for (var i = 0; i < hiddenEmailInputs.length; i++) {
                    hiddenEmailInputs[i].value = responsePayload.email;
                }

            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }

};


// Init (bootstrapping)
app.init = function () {
    //Bind all form submissions
    app.bindForms();

    // Get the token from localstorage
    app.getSessionToken();

    // Renew token
    app.tokenRenewalLoop();

    //Get products to shop 
    app.getProducts();

    //Get cart items from localstorage
    app.counter();

    //List items on localStorage
    app.listToCheckout();

    //Checkout order 
    app.checkoutOrder();

    // Bind logout logout button
    app.bindLogoutButton();

    //Account settings
    app.loadDataOnPage();

    app.checkoutFeedback();
};

// Call the init processes after the window loads
window.onload = function () {
    app.init();
};





