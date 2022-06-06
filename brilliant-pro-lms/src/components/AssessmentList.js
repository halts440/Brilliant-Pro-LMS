import { useState } from "react";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

function AssessmentList() {
    const navigate = useNavigate()
    const [ assessments, setAssessments] = useState([]);

    function getAllAssessmentsData() {
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

    getAllAssessmentsData()

    function deleteAssessment(delId) {
        fetch('http://localhost:4000/api/assessments/delete/'+delId, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
            })
            .then(response => response.json() )
            .then(data => {
                if( data.status === 'success') {
                    console.log('Assessment deleted successfully')
                    //navigate('/admin/assessments', {replace: true})
                    getAllAssessmentsData()
                }
                console.log('Success:', data);
            });
    }

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
                                <td><button className='btn btn-success' onClick={
                                    () => 
                                    navigate('/admin/assessments/'+elem._id)
                                }>View</button></td>
                                <td><Trash color='red' size={25} onClick={
                                    () => deleteAssessment(elem._id)
                                } /></td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}
export default AssessmentList;