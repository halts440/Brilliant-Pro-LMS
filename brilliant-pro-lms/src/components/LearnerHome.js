import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearnerCourseList from "./LearnerCourseList";
import LearnerNavigation from './LearnerNavigation'
import ShowCertificates from "./ShowCertificates";

function LearnerHome(props) {
    const navigate = useNavigate();
    const [myCourseList, setMyCourseList] = useState([])
    const myparams = useParams()

    function getUserCourseList() {
        fetch('http://localhost:4000/api/learners/'+myparams.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    setMyCourseList(data.learner.courses)
                }
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
            <h1>Learner Dashboard</h1>
            <LearnerCourseList myCourses={myCourseList} />
            <ShowCertificates id={myparams.id} />
        </div>
    );
};

export default LearnerHome;