import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <SignIn></SignIn>
    <SignUp></SignUp>
  </div>
);

reportWebVitals();
