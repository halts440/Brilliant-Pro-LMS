import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import { useNavigate } from "react-router-dom";


function LearnerCourseList(props) {
    const myCourseList = props.myCourses
    const navigate = useNavigate()
    const [ courses, setCourses] = useState([]);
    return (
        <div className="main-content-div">
            <h1 className='cheader'>My Courses</h1>
            {
            myCourseList.length > 0 &&
                <div className="row">{
                    myCourseList.map( (elem, index) => (
                        <div key={index} className="col-sm-4">
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" className="square-img" src={'http://localhost:4000/ci/'+elem.image} />
                                <Card.Body>
                                    <Card.Title>{elem.courseName} </Card.Title>
                                    <button variant="primary"
                                        className='btn btn-primary'
                                        onClick={ () => { navigate('/learner/courses/'+elem._id) }
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