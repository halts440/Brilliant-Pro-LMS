import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavigation from "./AdminNavigation";


function AddCourse(props) {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [courseName, setCourseName] = useState('')
    const [overview, setOverview] = useState('')
    const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/default_profile.jpg');
    const [image, setImage] = useState('');
    const [imageType, setImageType] = useState('default');
    const profileUploadRef = useRef(null);

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if( name === 'code')
            setCode(value)
        else if( name === 'courseName')
            setCourseName(value)
        else if( name === 'overview')
            setOverview(value)
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
        formData.append('status', 'active');
        formData.append('image', image);
        formData.append('imageType', imageType);

        fetch('http://localhost:4000/api/courses/add', {
            method: 'POST',
            body: formData,
            })
            .then(response => response.json() )
            .then(data => {
                if( data.status === 'success')  {
                    navigate('/admin/courses', {replace: true})
                }
                console.log('Success:', data);
            });
    }

    function openFileDialog() {
        profileUploadRef.current.click();
    }


    return (
        <div>
            <AdminNavigation />
            <div class="w-50 m-auto d-block pb-5">
            <h1 className="cheader">Add Course</h1>
            <table>
                <tbody>
                <tr>
                    <td><label>Code:</label></td>
                    <td><input type='text' name='code' value={code} onChange={handleChange}/></td>
                </tr>
                <br/>

                <tr>
                    <td><label>Name:</label></td>
                    <td><input type='text' name='courseName' value={courseName} onChange={handleChange}/></td>
                </tr>
                <br/>
                
                <tr>
                    <td><label>Overview:</label></td>
                    <td><textarea name='overview' value={overview} onChange={handleChange}/></td>
                </tr>
                <br/>

                <tr>
                    <td><label>Image:</label></td>
                    <td><img className="course-image-upload" src={imageSrc} alt='ProfilePicture' /></td>
                </tr>
                <br/>

                <tr>
                    <td><input type='file' name='image' hidden ref={profileUploadRef} onChange={handleChange}/></td>
                    <td><input
                    className="btn btn-primary"
                    type='button' value='Upload Image' onClick={openFileDialog}/></td>
                </tr>
                <br/>

                <tr>
                    <td></td>
                    <td><input
                        className="btn btn-primary"
                    type='submit' value='Add Course' onClick={handleSubmit}></input></td>
                </tr>

                
                </tbody>
            </table>
            </div>
        </div>

    );
};

export default AddCourse;