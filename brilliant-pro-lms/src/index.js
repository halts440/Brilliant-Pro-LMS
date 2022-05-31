import 'bootstrap/dist/css/bootstrap.min.css';
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

function Tommy(props) {
  return (
    <div>
      <h1>Brilliant Pro LMS</h1>
      <Link to='/signin'>Sign In</Link>
      <Link to='/signup'>Sign Up</Link>
    </div>
  )
}

function Jerry(props) {
  return (
    <div>
      <h1>Brilliant Pro LMS Testing ...</h1>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='*' element={<Tommy/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      
      <Route path='/learner' element={
        <ProtectedRoute role='learner'>
          <LearnerHome/>
        </ProtectedRoute>
      } />

      {/* <Route path='/admin' element= { <ProtectedRoute role='admin'>
          <AdminHome/> </ProtectedRoute>
      } /> */}

      <Route path='/admin' element={<ProtectedRoute role='admin'/>} >
        <Route path='/admin' element={<AdminHome/>} />
        <Route path='courses' element={<Courses/>} />
        <Route path='materials' element={<Materials/>} />
        <Route path='assessments' element={<Assessments/>} />
        <Route path='learners' element={<LearnersMgmt/>} />
        <Route path='/admin/learners/add' element={<AddLearner/>} />
      </Route>

    </Routes>
  </BrowserRouter>
);