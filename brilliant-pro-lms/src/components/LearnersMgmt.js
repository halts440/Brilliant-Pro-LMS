import AdminNavigation from './AdminNavigation';
import LearnersList from './LearnersList';

function LearnersMgmt() {

    return (
        <div>
            <AdminNavigation />
            <div>
                <h1>Manage Learners</h1>
                <LearnersList />
            </div>
        </div>
    );

};

export default LearnersMgmt;