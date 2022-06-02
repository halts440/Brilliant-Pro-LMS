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
                <button onClick={navigateToAddLearner}  className='btn btn-primary'> Add </button>
                <LearnersList />
            </div>
            
        </div>
    );

};

export default LearnersMgmt;