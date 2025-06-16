const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.session.authorization && req.session.authorization.accessToken;
    if (!token) {
        return res.status(403).json({message: "User not logged in"});
    }
    
    const jwtSecret = 'access'; // General secret for access tokens; in a real application, this should be more secure and stored in an environment variable
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
        return res.status(403).json({message: "Invalid token"});
        }
        req.user = user.data; // Store the username in the request object
        next();
    });
});
 
const PORT =4949;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
