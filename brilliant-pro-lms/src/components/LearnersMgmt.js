import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';
import LearnersList from './LearnersList';

function LearnersMgmt() {
    const navigate = useNavigate()
    function navigateToAddLearner() {
        navigate('/admin/learners/add', {replace: 'false'} )
    }
    return (
        <div>
            <AdminNavigation />
            <div>
                <h1 className='cheader'>Manage Learners</h1>
                <div className='w-50 my-centered-div d-flex justify-content-end'>
                    <button onClick={navigateToAddLearner}  className='btn btn-primary'> Add </button>
                </div>
                <LearnersList />
            </div>
        </div>
    );

};

export default LearnersMgmt;