import { useEffect, useState } from "react"

function CourseAssessments(props) {
    const [assessmentsList, setAssessmentsList] = useState([])
    const [addedAssessments, setAddedAssessments] = useState([])

    function getAssessmentsData() {
        fetch('http://localhost:4000/api/courses/'+props.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setAddedAssessments(data.course.assessmentsList)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })


        fetch('http://localhost:4000/api/assessments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setAssessmentsList(data.assessments)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })        
    }

    useEffect( () => {
        getAssessmentsData()
    }, [])

    function addCourseAssessment(courseId, assessmentId) {
        console.log("C: ", courseId)
        fetch('http://localhost:4000/api/courses/addCourseAssessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                assessment: assessmentId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getAssessmentsData() 
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    function removeCourseAssessment(courseId, assessmentId) {
        fetch('http://localhost:4000/api/courses/removeCourseAssessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                assessment: assessmentId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getAssessmentsData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    return (
        <div>
            <p>{props.id}</p>
            <p>ERRR: {addedAssessments.includes('abc')}</p>
            {
                assessmentsList && assessmentsList.length > 0 && (
                    <table>
                        <tbody>{
                        assessmentsList.map( (elem, index) =>
                            <tr key={index}>
                                <td>{elem.assessmentName}</td>
                                <td>
                                    { addedAssessments.includes(elem._id) && 
                                        (<button className="btn btn-danger" onClick={
                                            () => removeCourseAssessment(props.id, elem._id)
                                        }>Remove</button>)
                                    }
                                    {!addedAssessments.includes(elem._id) && 
                                        (<button className="btn btn-primary"
                                        onClick={
                                            () => addCourseAssessment(props.id, elem._id)
                                        }
                                        >Add</button>)
                                    }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                )
            }
        </div>
    )
}

export default CourseAssessments;