import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import AssessmentList from './AssessmentList';

function Assessments() {
    const navigate = useNavigate()
    function navigateToAddLearner() {
        navigate('/admin/assessments/add', {replace: 'false'} )
    }
    return (
        <div>
            <AdminNavigation />
            <div>
                <h1 className='cheader'>Assessments</h1>
                <div className='w-50 my-centered-div d-flex justify-content-end'>
                    <button onClick={navigateToAddLearner}  className='btn btn-primary'> Add </button>
                </div>
                <AssessmentList />
            </div>
        </div>
    );
};

export default Assessments;