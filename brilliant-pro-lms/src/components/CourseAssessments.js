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

    return (
        <div>
            <p>{addedAssessments.includes('abc')}</p>
            {
                assessmentsList && assessmentsList.length > 0 && (
                    <table>
                        <tbody>{
                        assessmentsList.map( (elem, index) =>
                            <tr key={index}>
                                <td>{elem.assessmentName}</td>
                                <td>
                                    { addedAssessments.includes(elem._id) && 
                                        (<button className="btn btn-danger">Remove</button>)
                                    }
                                    {!addedAssessments.includes(elem._id) && 
                                        (<button className="btn btn-primary"
                                        onClick={
                                            () => {
                                                //enrollLearner(props.id, elem._id)
                                            }
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