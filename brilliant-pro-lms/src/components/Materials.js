import { useEffect, useState, useRef } from 'react';
import AdminNavigation from './AdminNavigation';
import { ArrowLeftShort } from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal'
import { PencilSquare, Trash } from 'react-bootstrap-icons';

function Materials() {
    const [path, setPath] =useState('materials')
    const [oldPath, setOldPath] =useState('materials')
    const [nameList, setNameList] = useState([])
    const inputFile = useRef(null) 
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [newDirName, setNewDirName] = useState('')

    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);
    const [newName, setNewName] = useState('')
    const [editName, setEditName] = useState('')

    function getDirInfo(dirname) {
        fetch('http://localhost:4000/api/materials/d/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'},
            body: JSON.stringify({
                'dirname': dirname
            })
            })
            .then(response => response.json() )
            .then(data => {
                console.log('Success:', data);
                if(data.status === 'success') {
                    setNameList(data.nameList) 
                    let tmp = data.path.substring(0, data.path.lastIndexOf('/'))
                    tmp === 'materials' ?
                        setOldPath('materials'):
                        setOldPath(tmp)
                    setPath(data.path)
                }
            });
    }

    useEffect( ()=> {
        getDirInfo('materials')
    }, [])

    function handleDoubleClick(sub_dir_name) {
        if( !sub_dir_name.includes('.pdf') && !sub_dir_name.includes('.ppt') && !sub_dir_name.includes('.pptx')
        && !sub_dir_name.includes('.mp4') ) {
        getDirInfo(path+'/'+sub_dir_name)
        console.log("Double click works") }
    }

    function uploadFiles() {
        const fdata = new FormData()
        fdata.append('dirname', path)
        fdata.append('myfile', document.getElementById('materialFile').files[0] )
        fetch('http://localhost:4000/api/materials/upload', {
            method: 'POST',
            body: fdata,
        })
        .then( response => response.json() )
        .then( data => {
            console.log(data)
            getDirInfo(path)
         })
        .catch(
            error => console.log(error)
        );
    }

    function handleEdit() {
        if(editName.trim() !== newName.trim() ) {
            fetch('http://localhost:4000/api/materials/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'  },
                body: JSON.stringify({
                    'oldname': path+'/'+editName,
                    'newname': newName,
                }),
            })
            .then( response => response.json() )
            .then( data => {
                console.log(data)
                if(data.status === 'success') 
                    getDirInfo(path)
                else
                    console.log("Not Ok")
            })
            .catch(
                error => console.log(error)
            );
        }
    }

    function handleDelete(fname) {
        fetch('http://localhost:4000/api/materials/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'  },
            body: JSON.stringify({
                'fpath': path+'/'+fname,
            }),
        })
        .then( response => response.json() )
        .then( data => {
            if(data.status === 'success') {
                getDirInfo(path)
                alert('Deleted')
            }
            else {
                console.log("Not Ok")
                alert("Fail to delete")
            }
        })
        .catch(
            error => {
                console.log(error)
                alert("Some issue occured while deleting")
            }
        );
    }

    function handleCreateFolder() {
        if( newDirName.trim() !== '' ) {
            fetch('http://localhost:4000/api/materials/create-directory', {
                method: 'POST',
                body: JSON.stringify({
                    'parentDir': path,
                    'newDirName': newDirName
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then( response => response.json() )
            .then( data => {
                if(data.status === 'success') 
                    getDirInfo(path)
                setNewDirName('')
                setShow(false)
                alert('Folder created')
            })
            .catch( error => {
                console.log(error)
                alert('Cannot create folder')
                }
            );
        }
    }

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if( name === 'newDirName')
            setNewDirName(value)
        else if( name === 'newName')
            setNewName(value)
    }

    return (
        <div>
            <AdminNavigation />
            <div className='pb-5'>
                <input className='d-none' id='materialFile' onChange={ uploadFiles } name="myfile" type='file' ref={inputFile} />
            
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Folder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Folder Name</label>
                        <input type="text" name='newDirName' value={newDirName} onChange={handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                    <button variant="primary" onClick={handleCreateFolder}>
                        Create
                    </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEdit} onHide={handleEditClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edit Name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" name='newName' value={newName} onChange={handleChange}/>
                    </Modal.Body>
                    <Modal.Footer>
                    <button variant="primary" onClick={ () => {
                        handleEdit()
                        handleEditClose()
                    }}>
                        Update
                    </button>
                    </Modal.Footer>
                </Modal>

                <h1 className='cheader'>Materials</h1>
                <div className='p-3 w-75 materials-container'>
                    <div className='d-flex justify-content-between'>
                        <p className='d-inline'>
                            { path !== 'materials' && (<ArrowLeftShort className='back-arrow' size={35} onClick={() => getDirInfo(oldPath) } />)}
                            { path === 'materials' && (<ArrowLeftShort className='back-arrow-hidden' size={35} />)}
                        /{path}/</p>
                        <div>
                            <button className='btn btn-primary mx-sm-2' onClick={handleShow}>Create Folder</button>
                            <button className='btn btn-primary mx-sm-2' onClick={ () => inputFile.current.click() }>Upload File</button>
                        </div>
                    </div>
                    <div className='w-90 h-100'>
                        {
                            nameList.length > 0 && nameList.map( (elem, index) => (
                                <div className='m-3 d-flex justify-content-between align-items-center' key={index}>
                                    <div className='d-flex align-items-center mx-sm-2 mat-item' onDoubleClick={() => handleDoubleClick(elem) }>
                                    { elem.endsWith('.pdf') && 
                                        <img src={process.env.PUBLIC_URL + '/images/pdf.png'} />
                                    }
                                    { (elem.endsWith('.ppt') || elem.endsWith('.pptx') ) && 
                                        <img src={process.env.PUBLIC_URL + '/images/ppt.png'} />
                                    }
                                    { elem.endsWith('.mp4') && 
                                        <img src={process.env.PUBLIC_URL + '/images/video.png'} />
                                    }
                                    { !elem.includes('.pdf') && !elem.includes('.ppt') && !elem.includes('.pptx')
                                        && !elem.includes('.mp4') &&
                                        <img src={process.env.PUBLIC_URL + '/images/folder.png'} />
                                    }
                                    <p className='my-0 mx-sm-3'>{elem}</p>
                                    </div>
                                    <div>
                                        <PencilSquare className='mx-sm-3' color='#30AC13' size={27} onClick={ () => {
                                            setNewName(elem)
                                            setEditName(elem)
                                            handleEditShow()
                                        }} />
                                        <Trash className='mx-sm-3' color='#990F02' size={27} onClick={ () => handleDelete(elem) } />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Materials;