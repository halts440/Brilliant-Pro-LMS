// importing libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const Learner = require("./models/learner");
const Course = require("./models/course");
const Admin = require("./models/admin");

// connecting to mongodb
mongoose
  .connect('mongodb://127.0.0.1:27017/BrilliantProDB')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error('Error connecting to mongodb', err.reason);
  })

  // Setting up port with express js
//const employeeRoute = require('../backend/routes/employee.route')

// setting up express app
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(cors());
//app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/api', employeeRoute)
app.route("/").get( (req, res, next) => {
    res.send("Working");
});

app.route("/register").post( (req, res, next) => {
  const userData = req.body;
  console.log(userData);

  Learner.findOne({email: userData.email}, (err, data) => {
    if(data) {
      return res.json({
        status: "fail",
        message: "Email has already been taken"
      });
    }
    else {
      bcrypt.hash(userData.password, 10).then( (data) => {
          userData.password = data;
          if(userData.image == '') {
            userData.image = 'default';
          }
          const newLearner = new Learner({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            image: userData.image
          });
          newLearner.save((err, data) => {
            if(err)
              return res.json({
                status: "fail",
                message: "Failed to save new learner"
              })
            else
              return res.json({
                status: "success",
                message: "New learner added"
              })
          });
      });
    }
  });
});

app.route('/api/learners').get( (req, res) => {
  Learner.find({}, (err, data) => {
    if(err)
      return res.json({})
    else
      return res.json(data)
  })
})

app.route("/login").post( (req, res, next) => {
  const userLoggingIn = req.body;
  
  // Learner
  Learner.findOne({email: userLoggingIn.email})
  .then( dbUser => {
    if( dbUser ) {
      bcrypt.compare(userLoggingIn.password, dbUser.password)
      .then( isCorrect =>{
        if(isCorrect) {
          const payload =  {
            id: dbUser._id,
            email: dbUser.email,
            role: 'learner'
          }
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: 86400},
            (err, token) => {
              if (err) {
                return res.json({message: err,
                status: 'fail'
                })
              }
              else {
                return res.json({
                  status: 'success',
                  message: 'User logged in successfully',
                  token: 'Bearer '+ token,
                  role: 'learner'
                })
              }
            }
          );
        }
        else {
          res.json({
            status: 'fail',
            message: 'Incorrect password'
          })
        }
      })
    }
    else {
      
      // Admin
      Admin.findOne({email: userLoggingIn.email})
      .then( dbUser => {
        if( dbUser ) {
          bcrypt.compare(userLoggingIn.password, dbUser.password)
          .then( isCorrect =>{
            if(isCorrect) {
              const payload =  {
                id: dbUser._id,
                email: dbUser.email,
                role: 'admin'
              }
              jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {expiresIn: 86400},
                (err, token) => {
                  if (err) {
                    return res.json({message: err,
                    status: 'fail'
                    })
                  }
                  else {
                    return res.json({
                      status: 'success',
                      message: 'User logged in successfully',
                      token: 'Bearer '+ token,
                      role: 'admin'
                    })
                  }
                }
              );
            }
            else {
              res.json({
                status: 'fail',
                message: 'Incorrect password'
              })
            }
          })
        }
        else {
          res.json({
            status: 'fail',
            message: 'User not found'
          })
        }
      });
    }
  });

});

app.route("/course/:code").get( (req, res, next) => {
  Course.findOne({code: req.params.code}, (err, data) => {
    if(err) {
      return res.json({message: "Could not find course with this course code"});
    }
    else {
      return res.json({"data": data});
    }
  })
});

app.route('/course/:id').get( (req, res, next) => {
  Course.findById(req.params.id, (err, data) => {
    if(err) {
      return res.json({message: "Could not find course with this course id"});
    }
    else {
      return res.json({"data": data});
    }
  })
});

app.route('/course/:id').put( (req, res, next) => {
  Course.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
    if(err)
      return res.json({message: "An error occured"});
    return res.json({message: "Course updated sucessfully"});
  });
});

app.route("/admin/login").post( (req, res, next) => {
  const userLoggingIn = req.body;
  Admin.findOne({email: userLoggingIn.email})
  .then( dbUser => {
    if( !dbUser ) {
      return res.json({message: "Invalid Email or password"});
    }
    bcrypt.compare(userLoggingIn.password, dbUser.password)
    .then( isCorrect =>{
      if(isCorrect) {
        const payload =  {
          id: dbUser._id,
          email: dbUser.email,
          role: 'admin'
        }
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: 86400},
          (err, token) => {
            if (err) {
              return res.json({message: err})
            }
            else {
              return res.json({
                message: "Success",
                token: "Bearer "+token
              })
            }
          }
        );
      }
      else {
        return res.json({message: "Invalid password"})
      }
    })
  });
});


app.route("/admin/add").post( (req, res, next) => {
  const userData = req.body;
  console.log(userData);

  Admin.findOne({email: userData.email}, (err, data) => {
    if(data) {
      res.json({message: "An admin account with this email already exists"});
    }
    else {
      bcrypt.hash(userData.password, 10).then( (data) => {
          userData.password = data;
          if(userData.image == '') {
            userData.image = 'default';
          }
          const anotherAdmin = new Admin({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            image: userData.image
          });
          anotherAdmin.save( (err, data) => {
            if(err)
              return res.json({'message':'An issue occured while adding new admin account'});
            return res.json({message: "Admin added successfully"});
          });
      });
    }
  });
});

function verifyJWT(req, res, next) {
  const userRole = req.body.role;
  const token = req.headers['x-access-token']?.split(' ')[1];
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err)
        return res.json({
          isAuth: false,
          message: 'Failed to authenticate'
        })
      if(decoded.role === userRole) {
        req.user = {}
        req.user.id = decoded.id
        req.user.email = decoded.email
        req.isAuth = true
        next()
      }
      else {
        return res.json({
          isAuth: false,
          message: 'Incorrect user role'
        })
      }
    })
  }
  else {
    return res.json({
      isAuth: false,
      message: 'Incorrect token given'
    })
  }
}

app.route('/checkUser').post( verifyJWT, (req, res, next) => {
  return res.json({
    isAuth: req.isAuth,
    message: 'User is authenticated'
  });
});

app.route('/api/learners/delete/:id').delete( (req, res) => {
  Learner.findOneAndDelete({_id: req.params.id}, (err, data)=> {
    if(err) 
      return res.json({
        status: 'fail',
        message: 'Issue occured while deleting'
      })
    else
      return res.json({
        status: 'success',
        message: 'Deleted learner'
      })
  })
});


// starting server and listen to requets on port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port);
});