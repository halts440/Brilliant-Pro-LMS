import { useEffect, useState, useRef } from "react"

function UpdateCourseSettings (props) {
    const [code, setCode] = useState('')
    const [courseName, setCourseName] = useState('')
    const [overview, setOverview] = useState('')
    const [status, setStatus] = useState('')
    const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/default_profile.jpg');
    const [image, setImage] = useState('');
    const [imageType, setImageType] = useState('default');
    const profileUploadRef = useRef(null);

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
                    setStatus(data.course.status)
                    setImageSrc( 'http://localhost:4000/ci/'+data.course.image)
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
        else if( name === 'status')
            setStatus(value)
        else if( name === 'image') {
            setImage(event.target.files[0])
            if(imageType === 'default')
                setImageType('changed')
            setImageSrc( URL.createObjectURL( event.target.files[0] ) );
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('code', code);
        formData.append('courseName', courseName);
        formData.append('overview', overview );
        formData.append('status', status);
        formData.append('image', image);
        formData.append('imageType', imageType);

        fetch('http://localhost:4000/api/courses/update/'+props.id, {
            method: 'PUT',
            body: formData 
            })
            .then(response => response.json() )
            .then(data => {
                console.log(data)
                if(data.status === 'success') {
                    // course settings updated
                    getCourseData()
                }
            })
            .catch( (err) => {
                console.log("An error occured", err);
            })
    }

    function openFileDialog() {
        profileUploadRef.current.click();
    }

    return (
        <div>
            <table>
                <tbody>
                <tr>
                    <td><label>Code:</label></td>
                    <td><input type='text' name='code' value={code} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>Name:</label></td>
                    <td><input type='text' name='courseName' value={courseName} onChange={handleChange}/></td>
                </tr>
                
                <tr>
                    <td><label>Overview:</label></td>
                    <td><textarea name='overview' value={overview} onChange={handleChange}/></td>
                </tr>

                <tr>
                    <td><label>Status:</label></td>
                    <td>
                        <select name='status' value={status} onChange={handleChange}>
                            <option value='new'>New</option>
                            <option value='active'>Active</option>
                            <option value='inactive'>Inactive</option>
                        </select>
                    </td>
                </tr>

                <tr>
                    <td><label>Image:</label></td>
                    <td><img className="course-image-upload" src={imageSrc} alt='ProfilePicture' /></td>
                </tr>

                <tr>
                    <td><input type='file' name='image' hidden ref={profileUploadRef} onChange={handleChange}/></td>
                    <td><input type='button'
                    className="btn btn-primary" value='Upload Image' onClick={openFileDialog}/></td>
                </tr>

                <tr>
                    <td></td>
                    <td><input type='submit'
                    className="btn btn-primary" value='Update Course' onClick={handleSubmit}></input></td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UpdateCourseSettings;