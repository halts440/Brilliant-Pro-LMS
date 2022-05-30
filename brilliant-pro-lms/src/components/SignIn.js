import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignIn (props){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if(name === 'email')
            setEmail(value);
        else if(name === 'password') 
            setPassword(value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            'email': email,
            'password' : password
        }
        fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                console.log('Success:', data);
                if(data.status === 'success') {
                    localStorage.setItem('token', data.token);
                    if(data.role === 'learner')
                        navigate('/learner', {replace:true} )
                    else if(data.role === 'admin')
                        navigate('/admin', {replace:true} )
                }
            });
    }

    return (
        <div>

            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">Brilliant Pro LMS</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                <li className="nav-item active">
                    <Link className="nav-link" to='/signup'>Sign Up</Link>
                </li>
                </ul>
            </div>
            </nav>



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

export default SignIn;