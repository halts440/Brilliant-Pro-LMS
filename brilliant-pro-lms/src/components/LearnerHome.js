import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearnerCourseList from "./LearnerCourseList";
import LearnerNavigation from './LearnerNavigation'

function LearnerHome(props) {
    const navigate = useNavigate();
    const [myCourseList, setMyCourseList] = useState([])
    const userid = localStorage.getItem('userid')

    function getUserCourseList() {
        fetch('http://localhost:4000/api/learner/courses/enrolled/'+userid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success')
                    setMyCourseList(data.data)
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setMyCourseList([])
            })
    }

    useEffect(()=>{
        getUserCourseList()
    }, [])

    return (
        <div>
            <LearnerNavigation />
            <LearnerCourseList myCourses={myCourseList} />
        </div>
    );
};

export default LearnerHome;