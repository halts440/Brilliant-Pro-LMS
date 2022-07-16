import { useEffect, useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function LearnersList(props) {
    const navigate = useNavigate();
    const [allLearners, setAllLearners] = useState([]);

    function getAllLearnersData() {
        fetch('http://localhost:4000/api/learners', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                setAllLearners(data.learners)
                console.log( "data from server", data)
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setAllLearners([])
            })
    }

    useEffect( () => {
        getAllLearnersData()
    }, [])

    function disableLearner(user_id) {
        fetch('http://localhost:4000/api/learners/disable/'+user_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log('data', data)
                if(data.status === 'success') {
                    getAllLearnersData()
                    alert('Learner disabled')
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                alert('Some issue occured while disabling learner')
            })
    }

    function activateLearner(user_id) {
        fetch('http://localhost:4000/api/learners/activate/'+user_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    getAllLearnersData()
                    alert('Learner account activated')
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                alert('Some issue occured while activating learner account')
            })
    }

    return (
        <div>
            { allLearners.length > 0 && <div className='d-flex justify-content-center'>
                <table className="table table-hover w-50 justify-content-center">
                    <thead className='thead-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allLearners.map( (elem, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <th><img alt='' className='profile-rounded rounded-circle img-fluid' src={'http://localhost:4000/pi/'+elem.image} /></th>
                                <td>{elem.name}</td>
                                <td>{elem.email}</td>
                                <td><PencilSquare color='green' size={25} onClick={() => 
                                    navigate('/admin/learners/edit/'+elem._id) } /></td>
                                {
                                    elem.account_status === 'active' && 
                                    <td><button className='btn btn-danger'
                                        onClick={() => disableLearner(elem._id) }
                                    >Disbale</button></td>
                                }

                                {
                                    elem.account_status !== 'active' && 
                                    <td><button className='btn btn-success'
                                        onClick={() => activateLearner(elem._id) }
                                    >Active</button></td>
                                }
                                
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}
export default LearnersList;