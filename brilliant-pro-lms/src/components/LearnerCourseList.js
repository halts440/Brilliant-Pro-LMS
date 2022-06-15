import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";

function LearnerCourseList(props) {
    const myCourseList = props.myCourses
    const navigate = useNavigate()
    const [ courses, setCourses] = useState([]);

    function getAllCoursesData() {
        fetch('http://localhost:4000/api/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    setCourses(data.courses)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setCourses([])
            })
    }

    useEffect( () => {
        getAllCoursesData()
    }, [])

    return (
        <div>
            <h1>My Courses</h1>
            {
            courses.length > 0 &&
                <div className="row">{
                    courses.map( (elem, index) => (
                        myCourseList.includes(elem._id) &&
                        <div key={index} className="col-sm-4">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={process.env.PUBLIC_URL + "/course_image.webp"} />
                                <Card.Body>
                                    <Card.Title>{elem.courseName}</Card.Title>
                                    <button variant="primary" onClick={
                                        () => {
                                            navigate('/admin/courses/'+elem._id)   
                                        }
                                    }>View</button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default LearnerCourseList;