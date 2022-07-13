import AdminNavigation from "./AdminNavigation";

function AdminHome(props) {

    return (
        <div>
            <AdminNavigation />
            <div>
                <p>Total number of courses 45</p>
                <p>Number of learners: 45</p>
                <p>Certificates Issues: 67</p>
            </div>
        </div>
    );
};

export default AdminHome;