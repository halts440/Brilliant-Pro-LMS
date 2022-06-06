import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";


function AddCourse(props) {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [courseName, setCourseName] = useState('')
    const [overview, setOverview] = useState('')
    const [image, setImage] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [enrollmentLink, setEnrollmentLink] = useState('')

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if( name === 'code')
            setCode(value)
        else if( name === 'courseName')
            setCourseName(value)
        else if( name === 'overview')
            setOverview(value)
        else if( name === 'image')
            setImage(value)
        else if( name === 'startDate')
            setStartDate(value)
        else if( name === 'endDate')
            setEndDate(value)
        else if( name === 'enrollmentLink')
            setEnrollmentLink(value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        if(image === '')
            setImage('default')
        const data = {
            'code': code,
            'courseName': courseName,
            'overview' : overview,
            'image': image,
            'startDate': startDate,
            'endDate': endDate,
            'enrollmentLink' : enrollmentLink,
            'learnersList': [],
            'assessmentsList': [],
            'materialsList': []
        }
        fetch('http://localhost:4000/api/courses/add', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response.json() )
            .then(data => {
                if( data.status === 'success')  {
                    navigate('/admin/courses', {replace: true})
                }
                console.log('Success:', data);
            });
    }


    return (
        <div>
            <AdminNavigation />
            <h1>Add Course</h1>
            <table>
                <tbody>
                <tr>
                    <td><label>Code</label></td>
                    <td><input type='text' name='code' value={code} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>Name</label></td>
                    <td><input type='text' name='courseName' value={courseName} onChange={handleChange}/></td>
                </tr>
                
                <tr>
                    <td><label>Overview</label></td>
                    <td><textarea name='overview' value={overview} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>Image</label></td>
                    <td><img src={image} alt='ProfilePicture' /></td>
                </tr>

                <tr>
                    <td><label>Start Date</label></td>
                    <td><input type='date' name='startDate' value={startDate} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>End Date</label></td>
                    <td><input type='date' name='endDate' value={endDate} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>Enrollment Link</label></td>
                    <td><input type='text' name='enrollmentLink' value={enrollmentLink} onChange={handleChange}/></td>
                </tr>
                <tr>
                    <td><input type='submit' value='Add Course' onClick={handleSubmit}></input></td>
                    <td></td>
                </tr>

                
                </tbody>
            </table>
        </div>
    );
};

export default AddCourse;