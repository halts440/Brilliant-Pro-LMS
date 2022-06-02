import { useState } from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";

function AssessmentList() {
    const [ assessments, setAssessments] = useState([]);

    function getAllLearnersData() {
        fetch('http://localhost:4000/api/assessments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    setAssessments(data.assessments)
                    //console.log( "data from server", data)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setAssessments([])
            })
    }

    getAllLearnersData()

    return (
        <div>
            { assessments.length > 0 && <div className='d-flex justify-content-center'>
                <table className="table table-hover w-50 justify-content-center">
                    <thead className='thead-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Min Passing</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map( (elem, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{elem.assessmentName}</td>
                                <td>{elem.duration}</td>
                                <td>{elem.minPassing}</td>
                                <td><PencilSquare color='green' size={25} /></td>
                                <td><Trash color='red' size={25} /></td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}
export default AssessmentList;