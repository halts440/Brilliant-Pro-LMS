import { useNavigate } from "react-router-dom";

function LearnerHome(props) {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('token')
        navigate('/', {replace:true})
    }

    return (
        <div>
            <h1>Learner Dashboard</h1>
            <button onClick={logout}>Log out</button>
        </div>
    );
};

export default LearnerHome;