import { useEffect, useState, useRef } from 'react';
import AdminNavigation from './AdminNavigation';
import { ArrowLeftShort } from 'react-bootstrap-icons';

function Materials() {
    const [path, setPath] =useState('materials')
    const [oldPath, setOldPath] =useState('materials')
    const [nameList, setNameList] = useState([])
    const inputFile = useRef(null) 

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
            getDirInfo('materials')
         })
        .catch(
            error => console.log(error)
        );
    }

    return (
        <div>
            <AdminNavigation />
            <div>
                <input className='d-none' id='materialFile' onChange={ uploadFiles } name="myfile" type='file' ref={inputFile} />
            
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>

                <h1 className='cheader'>Materials</h1>
                <div className='p-3 w-90 materials-container'>
                    <div className='d-flex justify-content-between'>
                        <p className='d-inline'>
                            { path !== 'materials' && (<ArrowLeftShort size={35} onClick={() => getDirInfo(oldPath) } />)}
                        /{path}/</p>
                        <div>
                            <button className='btn btn-primary mx-sm-2' data-toggle="modal" data-target="#exampleModal">Create Folder</button>
                            <button className='btn btn-primary mx-sm-2' onClick={ () => inputFile.current.click() }>Upload File</button>
                        </div>
                    </div>
                    <div className='w-90 h-100'>
                        {
                            nameList.length > 0 && nameList.map( (elem, index) => (
                                <div className='m-3 d-flex align-items-center' key={index}>
                                    <input className="form-check-input" type="checkbox" id="checkboxNoLabel" value=""></input>
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