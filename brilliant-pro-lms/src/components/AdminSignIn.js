import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminSignIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if (name === 'email')
            setEmail(value);
        else if( name === 'password')
            setPassword(value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            'email': email,
            'password' : password
        }
        fetch('http://localhost:4000/admin/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem("token", data.token);
                navigate('/admin/home');
            })
            .catch( (err) => {
                console.log("Some error ", err);
            });
    }

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label>Email</label><br/>
                <input type='email' name='email' value={email} onChange={handleChange}/><br/>
                <label>Password</label><br/>
                <input type='password' name='password' value={password} onChange={handleChange}/><br/>
                <input type="submit" value="Sign In"></input><br/>
            </form>
        </div>
    );
};

export default AdminSignIn;