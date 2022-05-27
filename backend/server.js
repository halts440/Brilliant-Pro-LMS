// importing libraries
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

// connecting to mongodb
mongoose
  .connect('mongodb://127.0.0.1:27017/BrilliantProDB')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

  // Setting up port with express js
//const employeeRoute = require('../backend/routes/employee.route')

// setting up express app
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())
//app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/api', employeeRoute)
app.route("/").get( (req, res, next) => {
    res.send("Working");
});

// starting server and listen to requets on port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})