import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute (props) {
    const token = localStorage.getItem('token');
    const [auth_status, setAuthStatus] = useState('unkown')

    fetch('http://localhost:4000/checkUser', {
            method: 'POST',
            headers: {
                'x-access-token' : token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'role': props.role }),
            })
            .then(response => response.json() )
            .then(data => {
                if(data.isAuth)
                    setAuthStatus('valid')
                else
                    setAuthStatus('invalid')
            })
            .catch( (err) => {
                console.log("An error occured", err);
                return false;
            });
    
    return (<div>
    { auth_status === 'unkown' && <div></div>
    }
    {
    auth_status === 'valid' && <Outlet/>
    }
    {
    auth_status === 'invalid' && <Navigate to='/' replace />
    }
    </div>)
}

export default ProtectedRoute;