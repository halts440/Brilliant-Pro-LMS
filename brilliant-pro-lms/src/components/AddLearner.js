import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavigation from './AdminNavigation';

function AddLearner(props) {
    const navigate = useNavigate();
    const [uName, setUName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageSrc, setImageSrc] = useState(process.env.PUBLIC_URL + '/images/default_profile.jpg');
    const [image, setImage] = useState('');
    const [imageType, setImageType] = useState('default');
    const profileUploadRef = useRef(null);


    function handleChange(event) {
        const value = event.target.value;
        const tName = event.target.name;
        if( tName === 'name' )
            setUName(value)
        else if( tName === 'email')
            setEmail(value)
        else if( tName === 'password')
            setPassword(value)
        else if( tName === 'image') {
            setImage(event.target.files[0])
            if(imageType === 'default')
                setImageType('changed')
            setImageSrc( URL.createObjectURL( event.target.files[0] ) );
        }
        
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', uName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image);
        formData.append('imageType', imageType);

        fetch('http://localhost:4000/api/register', {
            method: 'POST',
            body: formData,
            })
            .then(response => response.json() )
            .then(data => {
                console.log('data', data)
                if(data.status === 'success') {
                    console.log('Success:', data);
                    navigate('/admin/learners', {replace:true} )
                }
            });
    }

    function openFileDialog() {
        profileUploadRef.current.click();
    }

    return (
        <div>
            <AdminNavigation />
            <div className='w-50 m-auto d-block pb-5'>
                <h1 className="cheader">Add Learner</h1>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label>Name:</label></td>
                                <td><input type='text' name='name' value={uName} onChange={handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Email:</label></td>
                                <td><input type='email' name='email' value={email} onChange={handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Password:</label></td>
                                <td><input type='password' name='password' value={password} onChange={handleChange}/></td>
                            </tr>
                            <tr>
                                <td><label>Profile Picture:</label></td>
                                <td><img className='profile-image-upload' src={imageSrc} alt='ProfilePicture' /></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><input type='file' name='image' hidden ref={profileUploadRef} onChange={handleChange}/></td>
                            </tr>

                            <tr>
                                <td></td>
                                <td><input type='button' className="btn btn-primary"  onClick={ openFileDialog } value='Upload Image'/></td>
                            </tr>

                            <tr>
                                <td></td>
                                <td><input type='submit' className="btn btn-primary" value='Sign Up'></input></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        </div>
    )
}

export default AddLearner;