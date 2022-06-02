import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

function Courses() {
    const navigate = useNavigate()
    function navigateToAddCourse() {
        navigate('/admin/courses/add', {replace: 'false'} )
    }

    return (
        <div>
            <AdminNavigation />
            <div>
                <h1 className='cheader'>Courses</h1>
                <button onClick={navigateToAddCourse}  className='btn btn-primary'> Add </button>
            </div>
        </div>
    );

};

export default Courses;