import React from 'react';
import { Link } from 'react-router-dom';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            image: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            'name': this.state.name,
            'email': this.state.email,
            'password' : this.state.password,
            'image': this.state.image
        }
        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response)
            .then(data => {
                console.log('Success:', data);
            });
    }

    render() {
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
                        <Link to='/signin'>Sign In</Link>
                        </li>
                        </ul>
                    </div>
                </nav>

                <h1>Sign Up</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>Name</label><br/>
                    <input type='text' name='name' value={this.state.name} onChange={this.handleChange}/><br/>
                    <label>Email</label><br/>
                    <input type='email' name='email' value={this.state.email} onChange={this.handleChange}/><br/>
                    <label>Password</label><br/>
                    <input type='password' name='password' value={this.state.password} onChange={this.handleChange}/><br/>
                    <label>Profile Picture</label><br/>
                    <img src={this.state.image} alt='ProfilePicture' /><br/>
                    <input type='submit' value='Sign Up'></input><br></br>
                </form>
                
            </div>
        );
    }
};

export default SignUp;