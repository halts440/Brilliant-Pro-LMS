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
const fs = require('fs')
const os = require('os')
const fileUpload = require('express-fileupload');

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

app.route('/api/courses/add').post( (req, res) => {
  const course = new Course(req.body)
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

app.route('/api/courses/update').put( (req, res) => {
  Course.findByIdAndUpdate(req.body.id, req.body.course, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to update course '+err
      })
    else
      return res.json({
        status: 'success',
        message: 'Course updated'
      })
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

app.route('/api/assessments/delete/:id').delete( (req, res) => {
  Assessment.findByIdAndDelete(req.params.id, (err, data) => {
    if(err)
      return res.json({
        status: 'fail',
        message: 'Failed to delete assessment'
      })
    else
      return res.json({
        status: 'success',
        message: 'Assessment deleted'
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

app.route('/api/courses/enroll').post( (req, res) => {
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
      myUserList.push(userId)
      Course.findByIdAndUpdate(courseId, {
        'learnersList': myUserList
      },
      (err, data) => {
        if(err) {
          return res.json({
            status: 'fail',
            message: 'Some issue occured while enrolling student'
          })
        } 
        else {
          return res.json({
            status: 'success',
            message: 'Successfully enrolled the student'
          })
        }
      })
    }
  })
})

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
          return res.json({
            status: 'success',
            message: 'Successfully unenrolled the student'
          })
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
      const myAssessmentList = data.assessmentsList
      myAssessmentList.splice( myAssessmentList.indexOf(assessmentId, 1 ) )
      Course.findByIdAndUpdate(courseId, {
        'assessmentList': myAssessmentList
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
        'assessments': data
      })
  })
})

app.route('/api/materials/d/').post( (req, res) => {
  var dirname = './public/' + req.body.dirname
  console.log(dirname)
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
    console.log(fpath)
    const fname = fpath.substr( fpath.lastIndexOf('/')+1, fpath.length )
    const dirname = fpath.substr(0, fpath.lastIndexOf('/') )
    console.log("Folder Name: ", dirname)
    console.log("File Name: ", fname)
    // find the file in materials collection
    Material.findOne({'filename': fname, 'path': dirname}, (err, data) => {
      if(err) {
        return res.json({
          status: 'fail',
          message: 'some issue occured on server side'
        })
      }
      else {
        // remove from courses
        // remove from actual directory
        try{
          fs.unlinkSync('./public/'+fpath)
          return res.json({
            status: 'success',
            message: 'Deleted the file'
          })
        }
        catch {
          return res.json({
            status: 'fail',
            message: 'Failed to delete the file'
          })
        }
      }
    })
  }
  else {
    // is a folder
    console.log("Just Folder: ", fpath)
    Material.find({path: {$regex: '/^'+fpath+'/'} }, (err, data) => {
      if(err) {
        return res.json({
          status: 'fail',
          message: 'Some issue occured on server side'
        })
      }
      else {
        // remove from courses
        // remove all files and folders in this directory recurrsively
        try {
            fs.rmdirSync('./public/'+fpath, { recursive: true });
            return res.json({
              status: 'success',
              message: 'Deleted the folder'
            })
        }
        catch (err) {
          return res.json({
            status: 'fail',
            message: 'Failed to remove folder' + err
          })
        }
      }
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
    console.log("Folder Name: ", dirname)
    console.log("File Name: ", fname)
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
          console.log("K: ./public/"+oldname)
          console.log("K: ./public/"+newname)
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
    console.log("Just Folder: ", oldname)
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
          console.log('Last Old: ./public/'+oldname)
          console.log('Last New: ./public/'+dirname )
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

// starting server and listen to requets on port
const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port);
});