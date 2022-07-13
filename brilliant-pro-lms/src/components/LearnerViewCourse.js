import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearnerNavigation  from './LearnerNavigation';
import { Tabs, Tab, Badge } from "react-bootstrap";
import { Circle, CircleFill } from 'react-bootstrap-icons'

function LearnerViewCourse(props) {
    const myparams = useParams()
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('Course Name')
    const [courseCode, setCourseCode] = useState('ABCD')
    const [courseOverview, setCourseOverView] = useState('')
    const [courseImage, setCourseImage] = useState('')
    const [courseStatus, setCourseStatus] = useState('active')
    const [materials, setMaterials] = useState([])
    const [assessments, setAssessments] = useState([])
    const [userCourseStatus, setUserCourseStatus] = useState('')
    const [certificate, setCertificate] = useState('')
    const [enrollmentStatus, setEnrollmentStatus] = useState('')

    const courseId = myparams.course_id;
    const learnerId = localStorage.getItem('userid')

    function getData() {
        // get course materials and assessments data
        fetch('http://localhost:4000/api/learner/courses/c/'+courseId+'/'+learnerId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
        })
        .then(response => response.json() )
        .then(data => {
            if(data.status === 'success') {
                console.log(data)
                setCourseCode( data.data.code )
                setCourseName( data.data.courseName )
                setCourseStatus( data.data.status )
                setCourseOverView( data.data.overview )
                setCourseImage( data.data.image )
                setMaterials( data.data.materialsList )
                setAssessments( data.data.assessmentsList )
                setUserCourseStatus( data.data.user_course_status )
                setCertificate( data.data.certificate )
                setEnrollmentStatus(data.user_status)
            }
        })
        .catch( (err) => {
            console.log("An error occured", err);
        })
    }

    useEffect( () => {
        getData()
    }, [])

    // mark a certain material as viewed
    function markCourseMaterial(materialId) {
        fetch('http://localhost:4000/api/mark_material', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                'materialId': materialId,
                'courseId': courseId,
                'learnerId': learnerId,
            }),
        })
        .then(response => response.json() )
        .then(data => {
            console.log(data);
            if(data.status === 'success') {
                getData();
            }
        })
        .catch( (err) => {
            console.log("Some issue occured while marking material as viewed", err);
        })
    }

    function enrollLearner() {
        fetch('http://localhost:4000/api/courses/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                'course': courseId,
                'learner': learnerId,
            }),
        })
        .then(response => response.json() )
        .then(data => {
            console.log(data);
            if(data.status === 'success') {
                getData();
            }
        })
        .catch( (err) => {
            console.log("Some issue occured while marking material as viewed", err);
        })
    }

    return (
        <div className='pb-5'>
            <LearnerNavigation></LearnerNavigation>
            <div className="container-80">
            <h2 className="cheader">{ courseCode} { courseName} 
            {   enrollmentStatus === 'enrolled' && 
                <button
                    className="btn btn-primary m-3"
                >Unenroll</button>
            }
            {   enrollmentStatus !== 'enrolled' && 
                <button
                    className="btn btn-primary m-3"
                    onClick={ () => {
                        enrollLearner()
    
                    }}
                >Enroll</button>
            }
            </h2>
            <img className="course-cover border m-auto d-block" src={'http://localhost:4000/ci/'+courseImage} alt='' />
            <br/><br/>
            <React.Fragment>{
                userCourseStatus === 'finished' && 
                <p>Congratulations on completing this course 
                    <button
                        onClick={ () => {
                            window.open('http://localhost:4000/certificates/'+certificate,'_blank');
                        }}
                        className="btn btn-primary m-3"
                    >View Certificate</button>
                </p>
            }</React.Fragment>
        
            <Tabs defaultActiveKey="details" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <p>Course Code: {courseCode}</p>
                    <p>Course Name: {courseName}</p>
                    <p>Overview: {courseOverview}</p>
                    <p>Course Status: {courseStatus}</p>
                </Tab>
                <Tab eventKey="materials" title="Materials">
                    <React.Fragment>
                        { materials.length > 0 &&
                            <table className="table table-hover w-50 justify-content-center d-block m-auto" >
                                <thead>
                                <tr>
                                    { enrollmentStatus === 'enrolled' &&  <th>Status</th> }
                                    <th>File Name</th>
                                    { enrollmentStatus === 'enrolled' &&  <th>Status</th> }
                                </tr>
                                </thead>
                                 {
                                    materials.map( (elem, index) => (
                                    <tbody>
                                        <tr key={index}>
                                            {
                                                enrollmentStatus === 'enrolled' &&
                                                <td>
                                                { elem.view_status === '1' &&
                                                    <CircleFill size={20} color='green' /> }
                                                {
                                                    elem.view_status === '0' &&
                                                    <Circle size={20} /> }
                                                </td>
                                            }
                                            <td>{elem.filename}</td>
                                            {   enrollmentStatus === 'enrolled' &&
                                                <td><button
                                                    onClick={ () => {
                                                        window.open('http://localhost:4000/'+elem.path+'/'+elem.filename,'_blank');
                                                        markCourseMaterial(elem._id);
                                                    } }
                                                    className='btn btn-primary'
                                                >View</button></td>
                                            }
                                        </tr>
                                    </tbody>
                                ))
                                }
                            </table>
                        }
                    </React.Fragment>
                </Tab>
                {   enrollmentStatus === 'enrolled' &&
                    <Tab eventKey="assessments" title="Assessments">
                        <React.Fragment>
                            { assessments.length > 0 &&
                            <table className="table table-hover w-50 justify-content-center d-block m-auto" >
                                <thead>
                                <tr><th>Status</th><th>Assessment Name</th><th></th></tr>
                                </thead>
                                {
                                    assessments.map( (elem, index) => (
                                    <tbody>
                                        <tr key={index}>
                                            <td>
                                                { elem.view_status === '1' &&
                                                    <CircleFill size={20} color='green' />
                                                }
                                                {
                                                    elem.view_status === '0' &&
                                                    <Circle size={20} />
                                                }
                                            </td>
                                            <td>{elem.assessmentName}</td>
                                            <td>
                                                { elem.view_status === '0' &&
                                                    <button
                                                    onClick={ ()=> {
                                                        navigate('/learner/attempt/'+courseId+ '/'+elem._id,{   replace: true})
                                                    }}
                                                    className='btn btn-primary'
                                                >Attempt</button>
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                ))
                                }
                            </table>
                            }
                        </React.Fragment>
                    </Tab>
                }
            </Tabs>
            </div>
        </div>
    )
}

export default LearnerViewCourse;