const express = require('express');
const bodyParser = require('body-parser');
// add jwt token 
const jwt = require('jsonwebtoken');
// create express app
const app = express();
// Setup server port
const port = process.env.PORT || 5000;
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(express.json())
// define a root route
app.get('/', (req, res) => {
    res.send("Hello Kuvar, Welcome to the home page");
});
// Require employee routes
const employeeRoutes = require('./src/routes/employee.routes')
// using as middleware
app.use('/api/v1/employees', employeeRoutes)
// listen for requests

// ===========going for changes to add jwt token for secure apis===============================

app.post('/api/login', (req, res) => {
    // create mock users
    const user = {
        id:1,
        username: "sumit",
        email: "sumit@gmail.com"
    }
    // var token = jwt.sign({email_id:'123@gmail.com'}, "Stack", {
    //     expiresIn: '24h' // expires in 24 hours
    //      });
    // expiresIn: '24h' means 24 hours it will show the expire time of api 
    jwt.sign({user:user}, 'secretKey', { expiresIn: '24h' }, (err, token) => {
        res.json({
            token
        })
    })
})


app.get('/api/test', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else {
            res.json({
                message: "Welcom to the secure API and token is verify",
                authData
            });
        }
    })
});

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//refrenceLink -: https://medium.com/@rahulguptalive/create-crud-apis-in-nodejs-express-and-mysql-abda4dfc2d6