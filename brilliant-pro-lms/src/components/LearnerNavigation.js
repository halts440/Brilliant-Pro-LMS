import { Link, useNavigate } from "react-router-dom";

function AdminNavigation(props) {

    const navigate = useNavigate();
    function logout() {
        localStorage.removeItem("token");
        navigate('/signup', {replace: true})
    }

    return (
        <nav className="navbar px-sm-5 py-sm-3 navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to='/learner'>Brilliant Pro LMS</Link>
            
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse d-flex justify-content-between navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to='/learner'>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/learner/all-courses/'>All Courses</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to='/learner/certificates'>Certificates</Link>
                    </li>
                </ul>
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </nav>
    )
}

export default AdminNavigation;