import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";

function CoursesList() {
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
                    //console.log( "data from server", data)
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
        <div> {
            courses.length > 0 &&
                <div className="row">{
                    courses.map( (elem, index) => (
                        <div key={index} className="col-sm-4">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="holder.js/100px180" />
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

export default CoursesList;