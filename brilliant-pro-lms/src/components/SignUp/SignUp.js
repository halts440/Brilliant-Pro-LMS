import React from 'react';

class SignUp extends React.Component {
    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <form>
                    <label>Name</label><br></br>
                    <input type="text"></input><br></br>
                    <label>Email</label><br></br>
                    <input type="text"></input><br></br>
                    <label>Password</label><br></br>
                    <input type="text"></input><br></br>
                    <label>Profile Picture</label><br></br>
                    <img src="" alt="ProfilePicture"></img><br></br>
                    <input type="submit" value="Sign Up"></input><br></br>
                </form>
            </div>
        );
    }
};

export default SignUp;