import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";
import LearnerNavigation from './LearnerNavigation';

function LearnerAllCourseList() {
    const navigate = useNavigate()
    const [ courses, setCourses] = useState([]);

    function getAllCoursesData() {
        fetch('http://localhost:4000/api/learner/courses/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log('data: ', data);
                if(data.status === 'success') {
                    setCourses(data.data);
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setCourses([]);
            })
    }

    useEffect( () => {
        getAllCoursesData()
    }, [])

    return (
        <div>
            <LearnerNavigation />
            <div className="main-content-div">
            <h1 className="cheader">All Courses</h1>
            {
            courses.length > 0 &&
                <div className="row">{
                    courses.map( (elem, index) => (
                        <div key={index} className="col-sm-4">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" className="square-img" src={'http://localhost:4000/ci/'+elem.image} />
                                <Card.Body>
                                    <Card.Title>{elem.courseName}</Card.Title>
                                    <button variant="primary"
                                        className="btn btn-primary"
                                        onClick={ () => { navigate('/learner/courses/'+elem._id) } }
                                    >View</button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            }
            </div>
        </div>
    )
}

export default LearnerAllCourseList;