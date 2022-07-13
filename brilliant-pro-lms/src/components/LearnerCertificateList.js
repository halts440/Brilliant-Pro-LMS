import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LearnerNavigation from './LearnerNavigation';

function LearnerCertificateList(props) {
    const [certificates, setCertificates] = useState([])

    function getAllCertificates() {
        fetch('http://localhost:4000/api/certificates/'+localStorage.getItem('userid'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    console.log(data)
                    setCertificates(data.data)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
                setCertificates([])
            })
    }

    useEffect( () => {
        getAllCertificates()
    }, [])

    
    return (
        <div>
            <LearnerNavigation />
            <div className="main-content-div">
            <h1 className="cheader">My Certificates</h1>
            { certificates.length > 0 && <div className='d-flex justify-content-center'>
                <table className="table table-hover w-50 justify-content-center">
                    <thead className='thead-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Course Name</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { certificates.length > 0 && certificates.map( (elem, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{elem.course_name}</td>
                                <td><button
                                    onClick={ () => {
                                        window.open('http://localhost:4000/certificates/'+elem.certificate,'_blank');
                                    }}
                                    className="btn btn-primary">View</button></td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>}
            </div>
        </div>
    )
}

export default LearnerCertificateList;