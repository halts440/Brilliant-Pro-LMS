import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShowCertificates(props) {
    const [certificates, setCertificates] = useState([])

    function getAllCertificates() {
        fetch('http://localhost:4000/api/certificates/'+props.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                if(data.status === 'success') {
                    console.log(data)
                    setCertificates(data.certificates)
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
            { certificates.length > 0 && <div className='d-flex justify-content-center'>
                <table className="table table-hover w-50 justify-content-center">
                    <thead className='thead-dark'>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">File Name</th>
                            <th scope="col">Course Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map( (elem, index) => (
                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{elem.fileName}</td>
                                <td>{elem.courseName}</td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>}
        </div>
    )
}

export default ShowCertificates;