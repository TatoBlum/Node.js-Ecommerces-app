Start server:
    node index.js

How to use API:
    1-Create a new user: http://localhost:3000/users [POST]
    2-Login: http://localhost:3000/login [POST]
        -When you loggin creates a token valid for a period of time.
    3-Add products to your cart: http://localhost:3000/cart [POST]
        -Product are hardcoded and are only available from 1 to 4. 
        -Loggin users can se list of products (http://localhost:3000/products).
    4-Proceed to checkout: http://localhost:3000/checkout [POST] 

TEST WITH POSTMAN, YOU CAN FIND EXAMPLES FOR EACH REQUEST
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/bdd897102b777793f91d)
