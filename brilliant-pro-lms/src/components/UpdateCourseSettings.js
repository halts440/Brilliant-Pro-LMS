import { useEffect, useState } from "react"

function UpdateCourseSettings (props) {
    const [code, setCode] = useState('')
    const [courseName, setCourseName] = useState('')
    const [overview, setOverview] = useState('')
    const [image, setImage] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [enrollmentLink, setEnrollmentLink] = useState('')

    function getCourseData() {
        fetch('http://localhost:4000/api/courses/'+props.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' },
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    setCode(data.course.code)
                    setCourseName(data.course.courseName)
                    setOverview(data.course.overview)
                    setImage(data.course.image)
                    setStartDate(data.course.startDate)
                    setEndDate(data.course.endDate)
                    setEnrollmentLink(data.course.enrollmentLink)
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    useEffect( () => {
        getCourseData()
    }, [])

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
            'learnersList': []
        }
        fetch('http://localhost:4000/api/courses/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' },
            body: JSON.stringify({
                'id': props.id,
                'course' : data
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    getCourseData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    return (
        <div>
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
                    <td><input type='submit' value='Update Course' onClick={handleSubmit}></input></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UpdateCourseSettings;