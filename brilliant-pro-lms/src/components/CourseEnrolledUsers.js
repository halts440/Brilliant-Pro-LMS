import { useEffect, useState } from "react"


function CourseEnrolledUsers(props) {
    const [learnersList, setLearnersList] = useState([])
    const [enrolledLearners, setEnrolledLearners] = useState([])

    function getLearnersData() {
        fetch('http://localhost:4000/api/courses/'+props.id, {
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


        fetch('http://localhost:4000/api/learners', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setLearnersList(data.learners)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })        
    }

    useEffect( () => {
        getLearnersData()
    }, [])

    function enrollLearner(courseId, learnerId) {
        fetch('http://localhost:4000/api/courses/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                learner: learnerId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getLearnersData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    function unenrollLearner(courseId, learnerId) {
        fetch('http://localhost:4000/api/courses/unenroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                learner: learnerId,
                course: courseId
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getLearnersData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    return (
        <div>
            {
                learnersList && learnersList.length > 0 && (
                    <table>
                        <tbody>{
                        learnersList.map( (elem, index) => (
                            elem.account_status === 'active' &&
                            <tr key={index}>
                                <td>{elem.name}</td>
                                <td>
                                    { enrolledLearners.includes(elem._id) && 
                                        (<button className="btn btn-danger"
                                        onClick={
                                            () => unenrollLearner(props.id, elem._id)
                                        }
                                        >Unenroll</button>)
                                    }
                                    {!enrolledLearners.includes(elem._id) && 
                                        (<button className="btn btn-primary"
                                        onClick={
                                            () => enrollLearner(props.id, elem._id)
                                        }
                                        >Enroll</button>)
                                    }
                                </td>
                            </tr>
                        )
                        )}
                        </tbody>
                    </table>

                )
            }
        </div>
    )
}

export default CourseEnrolledUsers;