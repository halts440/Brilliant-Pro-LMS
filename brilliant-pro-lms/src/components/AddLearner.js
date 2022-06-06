import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

function AddLearner(props) {
    const navigate = useNavigate();
    const [uName, setUName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');

    function handleChange(event) {
        const value = event.target.value;
        const tName = event.target.name;
        if( tName === 'name' )
            setUName(value)
        else if( tName === 'email')
            setEmail(value)
        else if( tName === 'password')
            setPassword(value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        const data = {
            'name': uName,
            'email': email,
            'password' : password,
            'image': image,
            'courses': []
        }
        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    console.log('Success:', data);
                    navigate('/admin/learners', {replace:true} )
                }
            });
    }

    return (
        <div>
            <AdminNavigation />
            <h1>Add Learner</h1>
            <form onSubmit={handleSubmit}>
                <label>Name</label><br/>
                <input type='text' name='name' value={uName} onChange={handleChange}/><br/>
                <label>Email</label><br/>
                <input type='email' name='email' value={email} onChange={handleChange}/><br/>
                <label>Password</label><br/>
                <input type='password' name='password' value={password} onChange={handleChange}/><br/>
                <label>Profile Picture</label><br/>
                <img src={image} alt='ProfilePicture' /><br/>
                <input type='submit' value='Sign Up'></input><br></br>
            </form>
        </div>
    )
}

export default AddLearner;