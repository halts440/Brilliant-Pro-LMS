import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute (props) {
    const token = localStorage.getItem('token');

    async function isAuthenticated() {
        return await fetch('http://localhost:4000/checkUser', {
            method: 'POST',
            headers: {
                'x-access-token' : token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'role': props.role }),
            })
            .then(response => response.json().isAuth )
            .catch( (err) => {
                console.log("An error occured", err);
                return false;
            });
    }

    if(token) {
        if( isAuthenticated() ) {
            return <Outlet/>
        }
    }
    return <Navigate to='/' replace />
}

export default ProtectedRoute;