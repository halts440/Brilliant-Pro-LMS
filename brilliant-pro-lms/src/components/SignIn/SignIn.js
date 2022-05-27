import React from 'react';

class SignIn extends React.Component {
    render() {
        return (
            <div>
                <h1>Sign In</h1>
                <form>
                    <label>Email</label><br></br>
                    <input type="text"></input><br></br>
                    <label>Password</label><br></br>
                    <input type="text"></input><br></br>
                    <input type="submit" value="Sign In"></input><br></br>
                </form>
            </div>
        );
    }
};

export default SignIn;