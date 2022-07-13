import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import CoursesList from './CoursesList';

function Courses() {
    const navigate = useNavigate()
    function navigateToAddCourse() {
        navigate('/admin/courses/add', {replace: 'false'} )
    }

    return (
        <div>
            <AdminNavigation />
            <div className='pb-5'>
                <h1 className='cheader'>Courses</h1>
                <div className='w-75 my-centered-div'>
                    <div className='d-flex justifty-content-right'>
                        <button
                         onClick={navigateToAddCourse}  className='btn btn-primary add-btn'> Add </button>
                    </div>
                    <CoursesList />
                </div>
            </div>
        </div>
    );

};

export default Courses;