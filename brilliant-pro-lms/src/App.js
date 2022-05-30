import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AdminHome from "./components/AdminHome";
import LearnerHome from "./components/LearnerHome";

function App(props) {

  const user = localStorage.getItem('bpuser')
  if( user == null ) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/signin' element={SignIn}></Route>
          <Route path='/signup' element={SignUp}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
  else {
    const authStatus = isAuthenticated(user.token, user.role)
    if(user.role === 'admin' && authStatus ) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path='/admin/' element={AdminHome}></Route>
          </Routes>
        </BrowserRouter>
      )      
    }
    else if(user.role === 'learner' && authStatus) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path='/learner/' element={LearnerHome}></Route>
          </Routes>
        </BrowserRouter>
      );
    }
    else {
      return (
        <BrowserRouter>
          <Routes>
            <Route path='/signin' element={SignIn}></Route>
            <Route path='/signup' element={SignUp}></Route>
          </Routes>
        </BrowserRouter>
      );
    }
  }
  
  function isAuthenticated(savedToken, userRole) {
    fetch('http://localhost:4000/checkAdmin', {
        headers: {
            'x-access-token' : savedToken
        },
        body: { 'role': userRole },
        })
        .then(response => response )
        .then(data => {
            return data.isAuth ? true: false;
        })
        .catch( (err) => {
            console.log("An error occured", err);
            return false;
        });
  }

}

export default App;
