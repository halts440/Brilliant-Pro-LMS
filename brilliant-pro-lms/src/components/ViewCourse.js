import { Tab, Tabs } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";
import CourseEnrolledUsers from "./CourseEnrolledUsers";
import UpdateCourseSettings from "./UpdateCourseSettings";
import CourseMaterials from "./CourseMaterials";
import CourseAssessments from "./CourseAssessments";

function ViewCourse() {
    const myparam = useParams()
    const navigate = useNavigate()
    const [learnersList, setLearnersList] = useState([])
    const [enrolledLearners, setEnrolledLearners] = useState([])

    useEffect( () => {
        fetch('http://localhost:4000/api/courses/'+myparam.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setEnrolledLearners(data.course.learnersList)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })        
    }, [])


    return (
        <div>
            <AdminNavigation />

            <Tabs defaultActiveKey="matandas" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="matandas" title="Materials and Assessments">
                    <div>
                        <h3>Materials</h3>
                        <CourseMaterials />
                        <h3>Assessments</h3>
                        <CourseAssessments />
                    </div>
                </Tab>
                <Tab eventKey="setting" title="Setting">
                    <UpdateCourseSettings id={myparam.id} />
                </Tab>
                <Tab eventKey="users" title="Users">
                    <CourseEnrolledUsers id={myparam.id}/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ViewCourse;