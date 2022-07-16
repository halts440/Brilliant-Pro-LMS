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
const Material = require("./models/material");
const Assessment = require('./models/assessment')
const LearnerProgress = require('./models/learnerprogress')
const fs = require('fs')
const os = require('os')
const fileUpload = require('express-fileupload');
var randomstring = require("randomstring");
const { jsPDF } = require("jspdf");

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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(cors());
app.use(express.static('public'))
app.use(fileUpload());
//app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
//app.use('/api', employeeRoute)
app.route("/").get( (req, res) => {
    res.send("Working");
});

app.route("/api/register").post( (req, res) => {
  const userData = req.body;

  // check there is already a learner registered with this email or not
  Learner.findOne({email: userData.email}, (err, data) => {
    if(data) {
      return res.json({
        status: "fail",
        message: "Email has already been taken"
      });
    }
    else {
      // encrypt the password
      bcrypt.hash(userData.password, 10).then( (data) => {
          userData.password = data;

          // save learner profile picture and its name
          if(userData.imageType=='default')
            userData.image = 'default_profile.png';
          else {
            imageFileName = req.files.image.name;
            fileExtenstion = imageFileName.substr( imageFileName.lastIndexOf('.') + 1 );
            imageFileName = randomstring.generate() + '.' + fileExtenstion;
            let myfile = req.files.image;
            myfile.mv( './public/pi/'+ imageFileName, imageFileName );
            userData.image = imageFileName;
          }

          // create a new learner and save its information in mongodb
          const newLearner = new Learner({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            image: userData.image,
            courses: [],
            account_status: 'active'
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
      return res.json({
        status: 'fail',
        message: 'Failed to get learners list'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the learners list',
        learners: data
      })
  })
})

// find the progress for all the courses of a particular learner
app.route('/api/learner-courses-list/:id').get( (req, res) => {
  // get the list of courses learner is enrolled in
  var learnerCoursesList = []
  var courseDetails = []
  var learnerProgress = []
  Learner.findById(
    req.params.id,
    {'courses': 1},
    (error, result) => {
      if(error) return res.json({
        'status': 'fail',
        'message': 'Could not get the list of courses learner is enrolled in'
      })

      // save learner's courses list
      learnerCoursesList = result.courses

      // get all the courses which user was enrolled in
      Course.find(
        {'_id': {$in: learnerCoursesList} },
        {
          'courseName': 1,
          'image': 1,
          'materialsList': 1,
          'assessmentsList': 1
        },
        (error, result) => {
          if(error) return res.json({
            'status': 'fail',
            'message': 'Could not get the list of courses learner is enrolled in'
          })

          // save course details
          courseDetails = result

          // get the progress of learner in these courses
          LearnerProgress.find(
            { 'userId': req.params.id,
              'courseId': {$in: learnerCoursesList} },
            { 'userId': 0,
              '_id': 0, 'createdAt': 0, 'updatedAt': 0, '__v': 0
            },
            (error, result) => {
              if(error) return res.json({
                'status': 'fail',
                'message': 'Could not get the list of courses learner is enrolled in'
              })

              // save learner progress
              learnerProgress = result

              var final_output = courseDetails.map(
                (courseItem, index) => {
                  // find the corresponding progress of learner
                  var lp = learnerProgress.find(lp => lp.courseId === courseItem._id.toString() )
                  if(lp) {
                    var total = courseItem.materialsList.length + courseItem.assessmentsList.length
                    var done = 0
                    const materialsDone = courseItem.materialsList.every(elem => {
                      return lp.materials.indexOf(elem) !== -1
                    })
                    const assessmentsDone = courseItem.assessmentsList.every(elem => {
                      return lp.assessments.indexOf(elem) !== -1
                    })
                    done = materialsDone + assessmentsDone
                    total += 10 // later to be removed
                    return {
                      'id': courseItem._id,
                      'courseName': courseItem.courseName,
                      'image': courseItem.image,
                      'percentage': done/total
                    }
                  }
                  else {
                    return res.json({
                      'status': 'fail',
                      'message': 'Some issue occured',
                    })
                  }
                }
              )
              if(!final_output) final_output = []

              return res.json({
                'status': 'success',
                'message': 'Got the list of courses learner is enrolled in',
                'courses': final_output
              })
            })
          
        }
      )
  })
})

app.route('/api/certificates/:userid').get( (req, res) => {
  LearnerProgress.find({
    'userId': req.params.userid,
    'status': 'finished'
  }, (error, data) => {
    if(error)
      return res.json({
        status: 'fail',
        message: 'Some issue occurred while getting certificates information'
      })
    else {
      courses_progress = data;
      if(data.length == 0) {
        return res.json({
          'status': 'success',
          'message': 'User has zero number of certificates',
          'data': []
        })
      }
      else{
        // get the courses list which user has passed.
        courses_ids = []
        for(var i=0; i<courses_progress.length; i++)
          courses_ids.push(courses_progress[i].courseId);
        Course.find({
          'id': { $in: courses_ids}
        }, (error, data) => {
          if(error) {
            return res.json({
              'status': 'fail',
              'message': 'Cannot get course names'
            })
          }
          else {
            final_data = []
            courses_progress.forEach( (elem) => {
              data.forEach( (elem2) => {
                if( elem.courseId === elem2._id.toString() ) {
                  final_data.push({
                    'course_name':  elem2.courseName,
                    'certificate': elem.certificate
                  })
                }
              })
            })

            return res.json({
              'status': 'success',
              'message': 'Got all the certificates data',
              'data': final_data
            })

          }
        })
      }
    }
  })
})

app.route("/login").post( (req, res, next) => {
  const userLoggingIn = req.body;
  
  // Learner
  Learner.findOne({email: userLoggingIn.email, 'account_status':'active'})
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
                  role: 'learner',
                  userid: dbUser._id
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

app.route('/api/learners/edit/:userid').put( (req, res) => {
  const userid = req.params.userid;
  const userData = req.body;
  const updateData = {}
  // get the learner information
  Learner.findOne(
    { '_id': userid },
    (err, data) => {
    if(data) {
      oldData = data;
      // if new password is given generate its hash
      if( userData.password != '') {
        updateData.password = bcrypt.hashSync(userData.password, 10);
      }

      // if name is changed save the changed name
      if( data.name != userData.name) {
        updateData.name = userData.name;
      }

      // if both emails donot match it means user provided a new email
      if(data.email != userData.email) {
        Learner.findOne({
          'email': userData.email
        },(err, data) => {
          if(data) {
            return res.json({
              status: "fail",
              message: "Email has already been taken"
            });
          }
          else {
            // can use this email. save in updateData
            updateData.email = userData.email;

            // image is changed
            if(userData.image != '') {
              imageFileName = req.files.image.name;
              fileExtenstion = imageFileName.substr( imageFileName.lastIndexOf('.') + 1 );
              imageFileName = randomstring.generate() + '.' + fileExtenstion;
              let myfile = req.files.image;
              myfile.mv( './public/pi/'+ imageFileName, imageFileName );
              updateData.image = imageFileName;
              try{ fs.unlinkSync('./public/pi/'+oldData.image) }
              catch { }
            }

            // update user 
            Learner.findByIdAndUpdate(
              { _id: userid },
              { $set: updateData },
              (err, data) => {
                if(err)
                  return res.json({
                    status: "fail",
                    message: "Fail to update learner information"
                  })
                else
                  return res.json({
                    status: "success",
                    message: "Updated learner information"
                  })
            })
          }
        })
      }
      // email is same
      else {
        // image is changed
        if(userData.image != '') {
          imageFileName = req.files.image.name;
          fileExtenstion = imageFileName.substr( imageFileName.lastIndexOf('.') + 1 );
          imageFileName = randomstring.generate() + '.' + fileExtenstion;
          let myfile = req.files.image;
          myfile.mv( './public/pi/'+ imageFileName, imageFileName );
          updateData.image = imageFileName;
          try{ fs.unlinkSync('./public/pi/'+oldData.image) }
          catch { }
        }

        // update user 
        Learner.findByIdAndUpdate(
          { _id: userid },
          { $set: updateData },
          (err, data) => {
            if(err)
              return res.json({
                status: "fail",
                message: "Fail to update learner information"
              })
            else
              return res.json({
                status: "success",
                message: "Updated learner information"
              })
          })
        }
    }
    else {
      // error user data not found
      return res.json({
        status: "fail",
        message: "No user with provided id was found"
      });
    }
  });
})

app.route('/api/learners/disable/:id').put( (req, res) => {
  const learnerId = req.params.id;
  Learner.findByIdAndUpdate({
    '_id': learnerId
  }, {
    'account_status': 'disable'
  }, (error, data) => {
    if(error)
      return res.json({
        'status': 'fail',
        'message': 'Cannot deactivate this account '+error
      })
    else
      return res.json({
        'status': 'success',
        'message': 'Account disabled'
      })
  })
});

app.route('/api/learners/activate/:id').put( (req, res) => {
  const learnerId = req.params.id;
  Learner.findByIdAndUpdate({
    '_id': learnerId
  }, {
    'account_status': 'active'
  }, (error, data) => {
    if(error)
      return res.json({
        'status': 'fail',
        'message': 'Cannot activate this account'
      })
    else
      return res.json({
        'status': 'success',
        'message': 'Account activated'
      })
  })
});

app.route('/api/learners/:id').get( (req, res) => {
  Learner.findById({_id: req.params.id}, (err, data)=> {
    if(err) 
      return res.json({
        status: 'fail',
        message: 'Issue occured while getting user data'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got all learner data',
        learner: data
      })
  })
});

app.route('/api/courses/add').post( (req, res) => {
  const newCourseInfo = req.body;

  // save the new course image
  imageFileName = req.files.image.name;
  fileExtenstion = imageFileName.substr( imageFileName.lastIndexOf('.') + 1 );
  imageFileName = randomstring.generate() + '.' + fileExtenstion;
  let myfile = req.files.image;
  myfile.mv( './public/ci/'+ imageFileName, imageFileName );

  newCourseData = {
    code: newCourseInfo.code,
    courseName: newCourseInfo.courseName,
    status: newCourseInfo.status,
    overview: newCourseInfo.overview,
    image: imageFileName,
    learnersList: [],
    materialsList: [],
    assessmentsList: [],
  }

  const course = new Course(newCourseData)
  course.save( (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to add course '+err
      })
    else
      return res.json({
        status: 'success',
        message: 'Course added'
      })
  })
})

app.route('/api/courses/update/:courseid').put( (req, res) => {
  const courseData = req.body;
  console.log(courseData);
  updateData = {
    code: courseData.code,
    courseName: courseData.courseName,
    status: courseData.status,
    overview: courseData.overview
  }

  // save new course image
  if(req.body.image != '') {
    imageFileName = req.files.image.name;
    fileExtenstion = imageFileName.substr( imageFileName.lastIndexOf('.') + 1 );
    imageFileName = randomstring.generate() + '.' + fileExtenstion;
    let myfile = req.files.image;
    myfile.mv( './public/ci/'+ imageFileName, imageFileName );
    updateData.image = imageFileName;
  }

  Course.findById(req.params.courseid, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Could not find the course'
      })
    else {
      oldData = data;
      Course.findByIdAndUpdate(req.params.courseid, updateData, (err, data) => {
        if(err)
          return res.json({
            status: 'fail',
            message: 'Failed to update course '+err
          })
        else {
          // if image was updated delete older image
          try{ fs.unlinkSync('./public/ci/'+oldData.image) }
          catch { }
          
          return res.json({
            status: 'success',
            message: 'Course updated'
          })
        }
      })
    }
  })
})

app.route('/api/assessments/add').post( (req, res) => {
  const assessment = new Assessment(req.body)
  assessment.save( (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to add assessment'
      })
    else
      return res.json({
        status: 'success',
        message: 'Assessment added'
      })
  })
})

app.route('/api/assessments/update/:id').put( (req, res) => {
  Assessment.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to update assessment'
      })
    else
      return res.json({
        status: 'success',
        message: 'Assessment updated'
      })
  })
})


// delete assessment with specified id
app.route('/api/assessments/delete/:id').delete( (req, res) => {
  const assessmentId = req.params.id;
  Course.find({})
  .then(data => {
    // if there are no courses in database, just delete the assessment
    if(data === null) {
      Assessment.findByIdAndDelete(assessmentId)
      .then(data => {
        return res.json({
          status: 'success',
          message: 'Assessment deleted'
        })
      })
    }
    else {
      // check if some course is using this assessment or not
      already_used = false
      data.forEach( (elem) => {
        aList = elem.assessmentsList;
        if(aList.includes(assessmentId))
          already_used = true;
      })
      // incase some course is using this assessment donot delete it
      if(already_used) {
        return res.json({
          status: 'fail',
          message: 'Failed to delete assessment'
        })
      }
      // if no course is using this assessment delete it
      else {
        Assessment.findByIdAndDelete(assessmentId)
        .then(data => {
          return res.json({
            status: 'success',
            message: 'Assessment deleted'
          })
        })
      }
    }
  })
  // handle errors
  .catch( error => {
    return res.json({
      status: 'fail',
      message: 'Failed to delete assessment'
    })
  })
})

app.route('/api/assessments').get( (req, res) => {
  Assessment.find({}, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to get assessments'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the assessments',
        'assessments': data
      })
  })
})

app.route('/api/courses').get( (req, res) => {
  Course.find({}, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to get courses list'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the courses list',
        'courses': data
      })
  })
})

app.route('/api/materials').get( (req, res) => {
  Material.find({}, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to get materials list'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the materials list',
        'materials': data
      })
  })
})

app.route('/api/courses/:id').get( (req, res) => {
  Course.findById(req.params.id, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to get course details'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the course details',
        'course': data
      })
  })
})

function addLearnerProgress(courseId, userId) {
  LearnerProgress.create({
    'userId': userId,
    'courseId': courseId,
    'status': 'unfinished',
    'materials': [],
    'assessments': [],
    'certificate': ''
  }, (err, data) => {
    if(err)
      return 0
    else
      return 1
  })
}

function removeLearnerProgress(courseId, userId) {
  LearnerProgress.findOneAndRemove({
    'userId': userId,
    'courseId': courseId
  }, (err, data) => {
    if(err)
      return 0
    else
      return 1
  })
}

function addCourseToLearner(courseId, userId) {
  Learner.findById(userId, (err, data)=> {
    if(err) {
      return 0
    }
    else {
      // add course to learner's course list
      var myCourseList = data.courses;
      myCourseList.push(courseId)
      Learner.findByIdAndUpdate(userId, {
        'courses': myCourseList
      }, (err, data) => {
        if(err) 
          return 0
        else 
          return 1
      })
    }
  })
}

app.route('/api/courses/enroll').post( (req, res) => {
  
  const courseId = req.body.course
  const userId = req.body.learner
  
  // find out the details of course in order to get learner's list
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      // add user to course's learner list
      const myUserList = data.learnersList
      myUserList.push(userId)
      Course.findByIdAndUpdate(courseId, {
        'learnersList': myUserList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while enrolling student at course learners list'
          })
        }
        else {
          if( addCourseToLearner(courseId, userId) ) {
            return res.json({
              status: 'fail',
              message: 'Some issue occured while enrolling student at course learners list'
            })
          } 
          else {
            addLearnerProgress(courseId, userId)
            return res.json({
              status: 'success',
              message: 'Student enrolled'
            })
          }
        }
      })
    }
  })
})

function removeCourseFromLearner(courseId, userId) {
  Learner.findById(userId, (err, data) => {
    if(err) {
      return 0
    }
    else {
      var coursesList = data.courses
      coursesList.splice( coursesList.indexOf(courseId), 1)
      Learner.findByIdAndUpdate(userId, {
        courses: coursesList
      }, (err, data) => {
        if(err)
          return 0
        else
          return 1
      })
    }
  })
}

app.route('/api/courses/unenroll').post( (req, res) => {
  const courseId = req.body.course
  const userId = req.body.learner
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      const myUserList = data.learnersList
      myUserList.splice( myUserList.indexOf(userId, 1 ) )
      Course.findByIdAndUpdate(courseId, {
        'learnersList': myUserList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while unenrolling student'
          })
        } 
        else {
          if( removeCourseFromLearner(courseId, userId) ){
            return res.json({
              status: 'fail',
              message: 'Some issue occured while unenrolling student'
            })
          }
          else{
            removeLearnerProgress(courseId, userId)
            return res.json({
              status: 'success',
              message: 'Student unenrolled from course'
            })
          }
        }
      })
    }
  })
})

app.route('/api/courses/addCourseAssessment').post( (req, res) => {
  const courseId = req.body.course
  const assessmentId = req.body.assessment
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      const myAssessmentList = data.assessmentsList
      myAssessmentList.push(assessmentId)
      Course.findByIdAndUpdate(courseId, {
        'assessmentsList': myAssessmentList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while adding assessment to course'
          })
        } 
        else {
          return res.json({
            status: 'success',
            message: 'Successfully added assessment item to course'
          })
        }
      })
    }
  })
})

app.route('/api/courses/removeCourseAssessment').post( (req, res) => {
  const courseId = req.body.course
  const assessmentId = req.body.assessment
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      const myAssessmentsList = data.assessmentsList
      myAssessmentsList.splice( myAssessmentsList.indexOf(assessmentId, 1 ) )
      Course.findByIdAndUpdate(courseId, {
        'assessmentsList': myAssessmentsList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while removing assessment item from course'
          })
        } 
        else {
          return res.json({
            status: 'success',
            message: 'Successfully removed assessment item from course'
          })
        }
      })
    }
  })
})

// materials
app.route('/api/courses/addCourseMaterial').post( (req, res) => {
  const courseId = req.body.course
  const materialId = req.body.material
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      const myMaterialsList = data.materialsList
      myMaterialsList.push(materialId)
      Course.findByIdAndUpdate(courseId, {
        'materialsList': myMaterialsList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while adding material to course'
          })
        } 
        else {
          return res.json({
            status: 'success',
            message: 'Successfully added material item to course'
          })
        }
      })
    }
  })
})

app.route('/api/courses/removeCourseMaterial').post( (req, res) => {
  const courseId = req.body.course
  const materialId = req.body.material
  Course.findById(courseId, (err, data) => {
    if(err) {
      return res.json({
        status: 'fail',
        message: 'failed to get course related information'
      })
    }
    else {
      const myMaterialsList = data.materialsList
      myMaterialsList.splice( myMaterialsList.indexOf(materialId, 1 ) )
      Course.findByIdAndUpdate(courseId, {
        'materialsList': myMaterialsList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while removing material item from course'
          })
        } 
        else {
          return res.json({
            status: 'success',
            message: 'Successfully removed material item from course'
          })
        }
      })
    }
  })
})

app.route('/api/assessments/:id').get( (req, res) => {
  Assessment.findOne({'_id': req.params.id}, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to get assessments'
      })
    else
      return res.json({
        status: 'success',
        message: 'Got the assessments',
        'assessment': data
      })
  })
})

app.route('/api/assessments/user-attempt').post( (req, res) => {
  // get all the data that is related to assessment attempt

  courseId = req.body.course_id;
  assessmentId = req.body.assessment_id;
  learnerId = req.body.learner_id;

  questions = req.body.questions;
  userAnswers = req.body.user_answers;
  min_passing = req.body.min_passing
  num_correct_answers = 0;
  passing_status = 'fail'

  // calculate results
  for(var i=0; i<questions.length; i++) {
    if( questions[i].correctOpt === userAnswers[i] )
      num_correct_answers += 1
  }
  percentage = (num_correct_answers / questions.length) * 100;
  percentage >= min_passing ? passing_status = 'pass': passing_status = 'fail';

  // check how many attempts user has already tried to pass this assessment
  LearnerProgress.findOne(
    {
      'userId': learnerId,
      'courseId': courseId,
    }, {
      '_id': 0,
      'assessments': 1
    },
    (error, data) => {
      // some issue occured while getting the previous progress of learner on assessments
      if(error)
        return res.json({
          'status': 'fail',
          'message': 'Could not find data for this user and course'
        })

      else {
        // get the previous progress of learner related to this assessment
        attempt_number = 0;
        data = data['assessments'];

        for(var i=0; i<data.length; i++) {
          if(data[i]['assessment_id'] === assessmentId) {
            attempt_number += data[i].attempt;
            break;
          }
        }

        // attempt number is 3, donot let user update progress
        if( attempt_number >= 3 ) {
          return res.json({
            'status': 'fail',
            'message': 'You have already attempted this assessment 3 times'
          })
        }
        else {
          attempt_number += 1;
          LearnerProgress.findOneAndUpdate()
          LearnerProgress.findOneAndUpdate({
            'userId': learnerId,
            'courseId': courseId,
          }, {
            $set: {
              'assessments': {
                'assessment_id': assessmentId,
                'status': passing_status,
                'attempt': attempt_number
              }
            } 
          }, {
            new: true
          }, (error, data) => {
            if(error)
              return res.json({
                'status': 'fail',
                'message': 'Some issue occured while saving the progress'
              })
            else {
              // update learner status in course
              updateLearnerProgress(courseId, learnerId)

              return res.json({
                'status': 'success',
                'message': 'Assessment result was saved',
                'data': {
                  'correct': num_correct_answers,
                  'percentage': percentage,
                  'passing_status': passing_status
                }
              })
            }
          })
        }
      }
    }
  )
})

function updateLearnerProgress(courseId, learnerId) {
  // find the course details
  Course.findOne({
    '_id': courseId
  }, (error, data) => {
    if(error) {
      // could not find course with this course id
    }
    else {
      // course materials and assessments
      c_materials = data.materialsList;
      c_assessments = data.assessmentsList;
      c_name = data.courseName;
    
      // find the learner's prgress
      LearnerProgress.findOne({
        'courseId': courseId,
        'userId': learnerId,
      }, (error, data) => {
        if(error) {
          // could not find learner's progress with this course and learner id
        }
        else {
          // if user has not already finished the course
          if(data.status != 'finished') {
            // learner's progress on materials and assessments
            lp_materials = data.materials;
            lp_assessments = data.assessments;   
            
            // generate results
            progress = 0;
            total_items = c_materials.length + c_assessments.length;
            c_materials.forEach( (elem) => {
              if(elem in lp_materials) 
                progress += 1;
            });
            c_assessments.forEach( (elem) => {
              for(var i=0; i<lp_assessments.length; i++) {
                if(elem === lp_assessments[i].assessment_id)
                  progress += 1;
              }
            })

            progress = (progress/total_items)*100;
            new_status = 'unfinished'
            if(progress === 100)
              new_status = 'finished'

            // get user name
            Learner.findOne({
              '_id': learnerId
            }, (err, data) => {
              if(error) {
                // issue occured while getting the user name
              }
              else {
                uName = data.name;

                // if user has finished the course generate its course passing certificate
                const doc = new jsPDF();
                certificate_text = `<div style= "
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 500px;
                ">
                    <h1>Brilliant Pro LMS</h1>
                    <h2>Certificate of Achievement</h2>
                    <p>This certificate is proudly presented to ${uName} for successfully completing the course contents of${c_name}.</p>
                </div>`
                doc.html( certificate_text, 20, 10);
                pdfFileName = randomstring.generate() + '.pdf';
                doc.save(`./public/certificates/${pdfFileName}`);

                // update learner progress
                LearnerProgress.findOneAndUpdate({
                  'courseId': courseId,
                  'userId': learnerId,
                }, {
                  'status': new_status,
                  'certificate': pdfFileName
                }, (error, data) => {
                  if(error)
                    console.log("Error")
                  else
                    console.log("Updated")
                });

              }
            })       
          }
        }
      })
    }
  })
}

app.route('/api/materials/d/').post( (req, res) => {
  var dirname = './public/' + req.body.dirname
  var data = []
  var status = 'success'
  try {
    fs.readdirSync(dirname).forEach(file => {
      data.push(file)
    });
  }
  catch {
    status = 'fail'
  }
  return res.json({
    'status': status,
    'nameList': data,
    'path': req.body.dirname
  })
})


app.route('/api/materials/upload').post( (req, res) => {
  try {
      if(!req.files) {
          return res.json({
              status: 'fail',
              message: 'No files were uploaded'
          });
      }
      else {
        let myfile = req.files.myfile;
        myfile.mv( './public/' + req.body.dirname + '/' + myfile.name, myfile.name)
        const newMaterial = new Material({
          filename: myfile.name,
          path: req.body.dirname,
          courses: []
        });
        newMaterial.save()
        return res.send({
            status: 'success',
            message: 'File is uploaded on server',
        });
      }
  } catch (err) {
    return res.json({
      status: 'fail',
      message: 'Some error occured while uploading'
    })
  }
})

app.route('/api/materials/create-directory').post( (req, res) => {
  const parentDir = './public/' + req.body.parentDir;
  const newDirName = req.body.newDirName;

  try {
    if(fs.existsSync(parentDir)) {
      if(fs.existsSync(parentDir+'/'+newDirName)) {
        return res.json({
          status: 'fail',
          message: 'Cannot create new folder as it already exists'
        })
      }
      else {
        fs.mkdirSync(parentDir+'/'+newDirName)
        return res.json({
          status: 'success',
          message: 'New folder created'
        })
      }
    }
    else {
      return res.json({
        status: 'fail',
        message: 'Parent directory does not exists'
      })
    }
  }
  catch {
    return res.json({
      status: 'fail',
      message: 'Some issue occured on server side'
    })
  }
})

app.route('/api/materials/delete').delete( (req, res) => {
  const fpath = req.body.fpath;
  // check if it is a filename or a folder name
  if( fpath.endsWith('.pdf') || fpath.endsWith('.pptx') || fpath.endsWith('.ppt') || fpath.endsWith('.mp4') ) {
    // is a file
    // seperate the filename and directory path
    const fname = fpath.substr( fpath.lastIndexOf('/')+1, fpath.length )
    const dirname = fpath.substr(0, fpath.lastIndexOf('/') )

    // check if the file is already being used in some course
    Course.find({})
    .then( data => {
      // there are not courses in database, so we can delete this material
      if(data === null) {
        // find the file in materials collection
        Material.findOneAndRemove({'filename': fname, 'path': dirname})
        .then( data => {
            fs.unlinkSync('./public/'+fpath)
            return res.json({
              status: 'success',
              message: 'Deleted the file'
            })
        })
        .catch( error => {
          return res.json({
            status: 'fail',
            message: 'some issue occured on server side'
          })
        })
      }
      else {
        // check if any course is using this material
        mList = data.materialsList;
        already_used = false;
        mList.forEach( elem => {
          if(elem.contains(materialId))
            already_used = true;
        })

        // material is being used in some course
        if(already_used) {
          return res.json({
            status: 'fail',
            message: 'Cannot delete this course material. It is being used in some course'
          })
        } 
        
        // material is not used in any course
        else {
          // find the file in materials collection
          Material.findOneAndRemove({'filename': fname, 'path': dirname})
          .then( data => {
              fs.unlinkSync('./public/'+fpath)
              return res.json({
                status: 'success',
                message: 'Deleted the file'
              })
          })
          .catch( error => {
            return res.json({
              status: 'fail',
              message: 'some issue occured on server side'
            })
          })
        }

      }
    })
    .catch( error => {
      return res.json({
        status: 'fail',
        message: 'some issue occured on server side'
      })
    })
  }

  else {
    // you want to delete a folder
    Material.find({path: {$regex: '/^'+fpath+'/'} })
    .then( data => {
      // we have list of materials which are descendant of this folder
      mList = data;

      // now check if these material ids are being used in any other courses
      already_used = false;
      Course.find({})
      .then( data => {
        if( mList !== null ) {
          cList = data;
          cList.forEach( elem => {
            course_mList = elem.materialsList;
            mList.forEach(elem2 => {
              if( course_mList.includes( elem2._id.toString() ))
                already_used = true;
            })
          })
        }
        
        // if the folder contains any materials that are being used in a course, do not delete the folder
        if(already_used) {
          return res.json({
            status: 'fail',
            message: 'This folder contains materials that are used in some courses'
          })
        }

        else {
          // delete the folder and its materials from directory
          fs.rmdirSync('./public/'+fpath, { recursive: true });

          // delete these materaisl from database as well
          Material.deleteMany({path: {$regex: '/^'+fpath+'/'} })
          .then( data => {
            return res.json({
              status: 'success',
              message: 'Deleted the folder'
            })
          })
        }
      })
    })
    // handle error
    .catch( error => {
      return res.json({
        status: 'fail',
        message: 'Some issue occured on server side'
      })
    })
  }
})

app.route('/api/materials/edit').put( (req, res) => {
  oldname = req.body.oldname
  newname = req.body.newname
  // check if it is a filename or a folder name
  if( oldname.endsWith('.pdf') || oldname.endsWith('.pptx') || oldname.endsWith('.ppt') || oldname.endsWith('.mp4') ) {
    // is a file
    // seperate the filename and directory path
    const fname = oldname.substr( oldname.lastIndexOf('/')+1, oldname.length )
    const dirname = oldname.substr(0, oldname.lastIndexOf('/') )
    // find the file in materials collection
    Material.findOne({'filename': fname, 'path': dirname}, (err, data) => {
      if(err) {
        return res.json({
          status: 'fail',
          message: 'Some issue occured on server side'
        })
      }
      else {
        // rename the file in database
        Material.findOneAndUpdate({'filename': fname, 'path': dirname}, {'filename': newname}, (err, data) => {
          if(err) {
            return res.json({
              status: 'fail',
              message: 'Some issue occured on server side'
            })
          }
        })

        // rename in actual directory
        try{
          fs.renameSync('./public/'+oldname, './public/'+dirname+'/'+newname)
          return res.json({
            status: 'success',
            message: 'Renamed the file'
          })
        }
        catch {
          return res.json({
            status: 'fail',
            message: 'Failed to rename the file'
          })
        }
      }
    })
  }
  else {
    // is a folder
    var dirname = oldname.substr(0, oldname.lastIndexOf('/') ) + '/' + newname 
    Material.updateMany({path: {$regex: '/^'+oldname+'/'}}, {path: dirname}, (err, data) => {
      if(err) {
        return res.json({
          status: 'fail',
          message: 'Some issue occured on server side'
        })
      }
      else {
        try {
            fs.renameSync('./public/'+oldname, './public/'+dirname);
            return res.json({
              status: 'success',
              message: 'Renamed folder'
            })
        }
        catch (err) {
          return res.json({
            status: 'fail',
            message: 'Failed to rename folder' + err
          })
        }
      }
    })
  }
})





// Routes related to courses from learner side

// get list of courses which are currently active
app.route('/api/learner/courses/all').get( (req, res) => {
  Course.find({
    status: 'active'
  }, (error, data) => {
    if(error) 
      return res.json({
        'status': 'fail',
        'message': 'Could not get courses list'+error
      })
    return res.json({
      'status': 'success',
      'message': 'Got the list of courses',
      'data': data
    })
  })
})

// get list of courses in which user enrolled
app.route('/api/learner/courses/enrolled/:userid').get( (req, res) => {
  Course.find({
    learnersList: req.params.userid
  },
  {
    learnersList: 0
  },
  (error, data) => {
    if(error) 
      return res.json({
        'status': 'fail',
        'message': 'Could not get courses list'+error
      })
    return res.json({
      'status': 'success',
      'message': 'Got the list of courses',
      'data': data
    })
  })
})

// get the details of a course. return result based on wether the student is enrolled in it or not
app.route('/api/learner/courses/c/:courseid/:userid').get( (req, res) => {
  courseid = req.params.courseid;
  userid = req.params.userid;
  if(userid == 'N')
    userid = '';
  course = [];
  Course.findById(courseid,
    {
      'createdAt': 0,
      'updatedAt': 0,
      '__v': 0
    },
    (error, data) => {
    if(error) 
      return res.json({
        'status': 'fail',
        'message': 'Could not find the course'
      })

    course = data.toObject();
    course_materials = [];

    // get the course materials details
    Material.find(
      {'_id': {$in: course['materialsList']} },
      {
        'courses': 0,
        'createdAt': 0,
        'updatedAt': 0,
        '__v': 0,
      },
      (error, data) => {
        if(error)
          res.json({
            'status': 'fail',
            'message': 'Issue occured while getting course materials details'
          })
        
        course_materials = data;
        course_assessments = [];

        // get the course assessments details
        Assessment.find(
          {'_id': {$in: course['assessmentsList']} },
          (error, data) => {
            if(error)
              res.json({
                'status': 'fail',
                'message': 'Issue occured while getting course assessments details'
              })

            course_assessments = data;
  
            // check if user is not in the list of enrolled learners
            if( !course['learnersList'].includes(userid) ) {
              course['materialsList'] = course_materials;
              course['assessmentsList'] = course_assessments;
              return res.json({
                'status': 'success',
                'message': 'Got course details, user not enrolled',
                'data': course,
                'user_status': 'not_enrolled',
              })
            }

            // user is enrolled in course so get the details of user
            user_cm_status = [];
            user_ca_status = [];
            LearnerProgress.findOne(
              {
                'userId': userid,
                'courseId': courseid
              },
              (error, data) => {
                if(error || data === null) 
                  return res.json({
                    'status': 'fail',
                    'message': 'Issue occured while getting learner progress in course'
                  })

                  user_cm_status = data['materials'];
                  user_ca_status = data['assessments'];
                  // update materials according to learner progress in course
                  course_materials.forEach( (value, index, array) => {
                    if( user_cm_status.includes(value['_id'].toString() ) ) 
                      course_materials[index]['view_status'] = '1';
                    else
                      course_materials[index]['view_status'] = '0';
                  })

                  // update assessments according to learner progress in course
                  course_assessments.forEach( (value, index, array) => {
                    course_assessments[index]['view_status'] = '0';
                    found = 0;
                    for(i=0; i<user_ca_status.length; i++) {
                      if( value['_id'].toString() == user_ca_status[i].assessment_id )
                        found = 1;
                    }
                    if(found)
                      course_assessments[index]['view_status'] = '1';
                  })

                  // update course materials and assessments data
                  course['materialsList'] = course_materials;
                  course['assessmentsList'] = course_assessments;
                  course['user_course_status'] = data.status;
                  course['certificate'] = data.certificate;
                  delete course['learnersList'];

                  return res.json({
                    'status': 'success',
                    'message': 'Got course details, user is enrolled',
                    'data': course,
                    'user_status': 'enrolled',
                  })
              }
            )
          }
        ).lean()
      }
    ).lean()
  })
})


// mark material
// when user has opened a video, pdf or ppt file, mark that file as done
app.route('/api/mark_material').post( (req, res) => {
  // get the material, course and learner id
  const materialId = req.body.materialId;
  const courseId = req.body.courseId;
  const learnerId = req.body.learnerId;
  // find the materials that user has already viewed for this course
  LearnerProgress.findOne({
    'userId': learnerId,
    'courseId': courseId
  })
  .then( learnerProgress => {
      return learnerProgress.materials;
  })
  .then( materials => {
    // check if user has already seen this material or not
    if( materials.includes(materialId) ) {
      res.json({
        'status': 'success',
        'message': 'Material was already marked'
      })
    }
    else {
      // if user has not seen the material before mark this material as done
      materials.push(materialId)
      LearnerProgress.findOneAndUpdate({
        'userId': learnerId,
        'courseId': courseId }, 
      { $set: { materials: materials} },
      { new: true })
      .then( update => {
        res.json({
          'status': 'success',
          'message': 'Have marked the material successfully'
        })
      })
    }
  })
  // respond to errors
  .catch( err => {
    res.json({
      'status': 'fail',
      'message': 'Some issue occured while marking this material as done '
    })
  })
})






// starting server and listen to requets on port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port);
});