import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Admin from './components/AdminHome';
import Courses from './components/Courses';
import LearnerHome from './components/LearnerHome';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHome from './components/AdminHome';
import LearnersMgmt from './components/LearnersMgmt';
import Materials from './components/Materials';
import Assessments from './components/Assessments';

import React from 'react';
import AddLearner from './components/AddLearner';
import AddAssessment from './components/AddAssessment';
import AddCourse from './components/AddCourse';
import ViewAssessment from './components/ViewAssessment';
import ViewCourse from './components/ViewCourse';
import LearnerViewCourse from './components/LearnerViewCourse';
import LearnerAllCourseList from './components/LearnerAllCourseList';
import EditLearner from './components/EditLearner';
import AttemptAssessment from './components/AttemptAssessment';
import LearnerCertificateList from './components/LearnerCertificateList';

function Tommy(props) {
  return (
    <div>
      <h1>Brilliant Pro LMS</h1>
      <Link to='/signin'>Sign In</Link>
      <Link to='/signup'>Sign Up</Link>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='*' element={<Tommy/>} />
      <Route path='/' element={<SignIn/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      
      <Route path='/learner' element={
        <ProtectedRoute role='learner'>
          <LearnerHome/>
        </ProtectedRoute>
      } />


      <Route path='/learner' element={<ProtectedRoute role='learner'/>} >
        <Route path='/learner' element={<LearnerHome/>} />
        <Route path='/learner/courses/:course_id' element={<LearnerViewCourse/>} />
        <Route path='/learner/all-courses/' element={<LearnerAllCourseList/>} />
        <Route path='/learner/attempt/:courseid/:assessmentid' element={<AttemptAssessment/>} />
        <Route path='/learner/certificates/' element={<LearnerCertificateList/>} />
      </Route>
      
      <Route path='/admin' element={<ProtectedRoute role='admin'/>} >
        <Route path='/admin' element={<AdminHome/>} />
        <Route path='courses' element={<Courses/>} />
        <Route path='materials' element={<Materials/>} />
        <Route path='assessments' element={<Assessments/>} />
        <Route path='learners' element={<LearnersMgmt/>} />
        <Route path='/admin/learners/add' element={<AddLearner/>} />
        <Route path='/admin/learners/edit/:userid' element={<EditLearner/>} />
        <Route exact path='/admin/assessments/add' element={<AddAssessment/>} />
        <Route path='/admin/assessments/:id' element={<ViewAssessment/>} />
        <Route path='/admin/courses/add' element={<AddCourse/>} />
        <Route path='/admin/courses/:id' element={<ViewCourse/>} />
      </Route>

    </Routes>
  </BrowserRouter>
);