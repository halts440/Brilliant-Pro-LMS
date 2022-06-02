import { useState } from "react";
import AdminNavigation from "./AdminNavigation";


function AddCourse(props) {
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
        const data = {
            'code': code,
            'name': courseName,
            'overview' : overview,
            'image': image,
            'startDate': startDate,
            'endDate': endDate,
            'enrollmentLink' : enrollmentLink,
        }
        fetch('http://localhost:4000/courses/create', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then(response => response)
            .then(data => {
                console.log('Success:', data);
            });
    }


    return (
        <div>
            <AdminNavigation />
            <h1>Add Course</h1>
            <form onSubmit={handleSubmit}>

                <label>Code</label><br/>
                <input type='text' name='code' value={code} onChange={handleChange}/><br/>

                <label>Name</label><br/>
                <input type='text' name='name' value={courseName} onChange={handleChange}/><br/>
                
                <label>Overview</label><br/>
                <textarea name='overview' value={overview} onChange={handleChange}/><br/>

                <label>Image</label><br/>
                <img src={image} alt='ProfilePicture' /><br/>

                <label>Start Date</label><br/>
                <input type='date' name='startDate' value={startDate} onChange={handleChange}/><br/>
                
                <label>End Date</label><br/>
                <input type='date' name='endDate' value={endDate} onChange={handleChange}/><br/>

                <label>Enrollment Link</label><br/>
                <input type='text' name='enrollmentLink' value={enrollmentLink} onChange={handleChange}/><br/>
                
                <input type='submit' value='Sign Up'></input><br></br>
            </form>
        </div>
    );
};

export default AddCourse;