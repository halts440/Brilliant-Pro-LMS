import { useEffect, useState } from 'react';
import { PencilSquare, Trash } from 'react-bootstrap-icons';

function LearnersList(props) {
    const [allLearners, setAllLearners] = useState([]);

    useEffect( () => {
        fetch('http://localhost:4000/api/learners', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => setAllLearners(data))
            .catch( (err) => {
                console.log("An error occured", err);
                setAllLearners([])
        })
    }, [])

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
                                <th><img className='rounded-circle img-fluid' src=''></img></th>
                                <td>{elem.name}</td>
                                <td>{elem.email}</td>
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
export default LearnersList;